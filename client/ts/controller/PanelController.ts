import * as d3 from 'd3'

import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {WordLine, WordLineHoverEvent} from "../vis/WordLine"
import {AttentionVis, AttentionVisData} from "../vis/AttentionVis";
import {WordProjector, WordProjectorClickedEvent} from "../vis/WordProjector";
import {S2SApi, TrainDataIndexResponse, Translation} from "../api/S2SApi";
import {PanelManager} from "./PanelManager";
import {
    StateDesc,
    StateProjector,
    StateProjectorClickEvent, StateProjectorHoverEvent
} from "../vis/StateProjector";
import * as _ from 'lodash';
import {StatePictograms, StatePictogramsHovered} from "../vis/StatePictograms";


export class PanelController {
    private readonly eventHandler: SimpleEventHandler;
    private pm: PanelManager;
    private _current = {
        beamIndex: 0,
        inWordPos: [],
        outWordPos: [],
        inWords: [],
        outWords: [],
        allNeighbors: {},
        projectedNeighbor: null,
        sentence: null
    };

    constructor() {
        this.eventHandler = new SimpleEventHandler(<Element> d3.select('body').node());
        this.pm = new PanelManager(this.eventHandler);

        this._init();
        this._bindEvents();

    }

    _init() {


    }

    selectProjection(key) {
        this._current.projectedNeighbor = key;
        this.pm.vis.projectors.update({
            states: this._current.allNeighbors[key],
            loc: key
        });
        this.pm.vis.statePicto.update(null);
    }

    updateProjectorData(allNeighbors) {
        const cur = this._current;

        cur.allNeighbors = allNeighbors;

        const allNeighborKeys = Object.keys(allNeighbors);
        if (!cur.projectedNeighbor) cur.projectedNeighbor = allNeighborKeys[0];

        this.pm.updateProjectionSelectField(allNeighborKeys, cur.projectedNeighbor);

        this.selectProjection(cur.projectedNeighbor);
    }

    update(raw_data, main = this.pm.vis.left, extra = this.pm.vis.zero) {

        const cur = this._current;


        //=== translation object with convenience functions
        const translation = new Translation(raw_data);
        translation.filterAttention(.75);

        //=== update words:
        const enc = main.encoder_words;
        const dec = main.decoder_words;
        enc.update({wordRows: [translation.encoderWords]});
        dec.update({wordRows: [translation.decoderWords[cur.beamIndex]]});

        //=== update attention using measures from word lists:
        const attentionData: AttentionVisData = {
            inWidths: enc.rows[0].map(t => t.width),
            outWidths: dec.rows[cur.beamIndex].map(t => t.width),
            inPos: enc.positions[0],
            outPos: dec.positions[cur.beamIndex],
            edgeWeights: translation.attnFiltered[cur.beamIndex]
        };
        const attn = main.attention;
        attn.update(attentionData);


        main.encoder_states.update({
            row: translation.encoderNeighbors
        });
        main.decoder_states.update({
            row: translation.decoderNeighbors[cur.beamIndex]
        });
        main.context.update({
            row: translation.contextNeighbors[cur.beamIndex]
        });

        if (main == this.pm.vis.left) {
            this._current.sentence = translation.inputSentence;
            this.updateProjectorData(raw_data.allNeighbors);
        }


        // main.encoder_extra.forEach(e => e.update(translation));
        // main.decoder_extra.forEach(e => e.update(translation));


        //=== setup column
        if (extra) {

            //=== helper function to
            const extentScores = (scores) => {
                const ex = <[number, number]>d3.extent(scores);
                if (ex[0] * ex[1] > 0) {
                    if (ex[0] > 0) ex[0] = ex[1];
                    ex[1] = 0;
                }
                return ex;
            };

            extra.decoder_words.update({
                extent: extentScores(translation.scores),
                values: [translation.scores[cur.beamIndex]]
            });

            // extra.decoder_extra.forEach(d => {
            //     if ('updateOptions' in d) {
            //         d.updateOptions({options: {xScale: extra.decoder_words.xScale}});
            //         d.update(translation);
            //     }
            //
            // })

        }


    }


    cleanPanels() {
        this.pm.closeAllRight();
        this.pm.removeMediumPanel();
    }


    updateAndShowWordProjector(data) {
        const wp = this.pm.getWordProjector();
        console.log(data, "--- data");
        wp.update(data);
    }


    updateAndShowWordList(data) {
        const wl = this.pm.getWordList();
        wl.update(data);
    }


    _bindEvents() {


        const vis = this.pm.vis;

        const determinePanelType = caller => {
            if ((caller === vis.left.encoder_words)) //_.includes(vis.left.encoder_extra, caller)
                return {
                    vType: AttentionVis.VERTEX_TYPE.Encoder,
                    col: vis.left
                };
            else if ((caller === vis.middle.encoder_words))
                return {
                    vType: AttentionVis.VERTEX_TYPE.Encoder,
                    col: vis.middle
                };
            else if ((caller === vis.middle.decoder_words))
                return {
                    vType: AttentionVis.VERTEX_TYPE.Decoder,
                    col: vis.middle
                };
            else return {
                    vType: AttentionVis.VERTEX_TYPE.Decoder,
                    col: vis.left
                };
        };


        this.eventHandler.bind(WordLine.events.wordSelected, (d, e) => {
            if (d.caller === vis.left.encoder_words
                || d.caller === vis.left.decoder_words) {

                let loc = 'src';
                if (d.caller === vis.left.decoder_words) {
                    loc = 'tgt'
                }

                d.caller.highlightWord(d.row, d.index, d.selected, true, 'selected');

                const allWords = d.caller.firstRowPlainWords;

                S2SApi.closeWords({input: d.word.word.text, loc, limit: 20})
                    .then(data => {


                        const word_data = JSON.parse(data);
                        // this.updateAndShowWordProjector(word_data);
                        const replaceIndex = d.index;
                        if (loc === 'src') {
                            const pivot = allWords.join(' ');

                            const compare = word_data.word.map(wd => {
                                return allWords.map((aw, wi) =>
                                    (wi === replaceIndex) ? wd : aw).join(' ');
                            })

                            S2SApi.compareTranslation({pivot, compare})
                                .then(data => {
                                    word_data["compare"] = JSON.parse(data)["compare"];
                                    // this.updateAndShowWordList(word_data);
                                    this.updateAndShowWordProjector(word_data);
                                })

                        } else {
                            // this.updateAndShowWordList(word_data);
                            this.updateAndShowWordProjector(word_data);
                        }


                    })
                    .catch(error => console.log(error, "--- error"));


            }


        })

        const actionWordHovered = (d: WordLineHoverEvent) => {
            d.caller.highlightWord(d.row, d.index, d.hovered);

            const {vType, col} = determinePanelType(d.caller);
            let transID = 0;
            if (col != this.pm.vis.left) {
                col.attention.actionHighlightEdges(d.index, vType, d.hovered);
                transID = 1;
            }
            this.pm.vis.left.attention.actionHighlightEdges(d.index, vType, d.hovered);


            const proj = this.pm.vis.projectors;

            if (vType === AttentionVis.VERTEX_TYPE.Encoder &&
                proj.loc === 'src') {

                proj.actionHoverPivot(transID, d.index, d.hovered);

            }
            else if (vType === AttentionVis.VERTEX_TYPE.Decoder &&
                proj.loc === 'tgt') {

                proj.actionHoverPivot(transID, d.index, d.hovered);

            }


        }


        this.eventHandler.bind(WordLine.events.wordHovered, actionWordHovered)


        this.eventHandler.bind(WordProjector.events.wordClicked,
            (d: WordProjectorClickedEvent) => {

                d.caller.highlightWord(d.word, true,
                    true, 'selected');


                S2SApi.translate_compare({
                    input: this._current.sentence,
                    compare: d.sentence
                }).then(data => {

                        const {main, extra} = this.pm.getMediumPanel();

                        const d = <{ in: any, compare: any, neighbors: any }>JSON.parse(data);

                        console.log(d, "--- d");
                        this.update(d.compare, main, null);

                        this.updateProjectorData(d.neighbors);


                    }
                )


            })

        this.eventHandler.bind(StateProjector.events.clicked,
            (d: StateProjectorClickEvent) => {
                d.caller.actionSelectPoints(d.pointIDs);

                S2SApi.trainDataIndices(d.neighborIDs, d.loc).then(data => {
                    const raw_data = <TrainDataIndexResponse> JSON.parse(data);

                    this.pm.getInfoPanel().setTrans(raw_data.res);
                    console.log(raw_data, "--- data");
                })

            })


        const projectHovered = (loc: string, transID: number,
                                wordID: number, hovered: boolean) => {
            const panels = [this.pm.vis.left, this.pm.vis.middle];

            let vType = AttentionVis.VERTEX_TYPE.Encoder;

            const visRoot = panels[transID];
            if (loc === 'src') {
                visRoot.encoder_words.highlightWord(0, wordID, hovered)
            } else {
                vType = AttentionVis.VERTEX_TYPE.Decoder;
                visRoot.decoder_words.highlightWord(0, wordID, hovered)
            }

            for (const tID in _.range(transID + 1)) {
                const visRoot = panels[tID];
                visRoot.attention.actionHighlightEdges(wordID, vType, hovered);
            }

            this.pm.vis.projectors.actionHoverPivot(transID, wordID, hovered);
            this.pm.vis.statePicto.actionHighlightSegment(transID, wordID, hovered)


        }


        this.eventHandler.bind(StateProjector.events.hovered,
            (d: StateProjectorHoverEvent) => {
                // d.caller.actionHoverPivot(d.transID, d.wordID, d.hovered);


                projectHovered(d.loc, d.transID, d.wordID, d.hovered);


                // d.caller.actionSelectPoints(d.pointIDs);
                //
                // S2SApi.trainDataIndices(d.neighborIDs, d.loc).then(data => {
                //     const raw_data = <TrainDataIndexResponse> JSON.parse(data);
                //
                //     this.pm.getInfoPanel().setTrans(raw_data.res);
                //     console.log(raw_data, "--- data");
                // })

            });

        this.eventHandler.bind(StatePictograms.events.segmentHovered,
            (d: StatePictogramsHovered) => {
                const seg = d.segment;
                // d.caller.actionHighlightSegment(seg.transID, seg.wordID, d.hovered);

                projectHovered(seg.loc, seg.transID, seg.wordID, d.hovered);

                this.pm.vis.projectors
                    .actionHoverRegion([{
                        x: seg.x,
                        y: seg.y,
                        h: seg.oh,
                        w: seg.ow
                    }], d.hovered)


            }
        )


        this.pm.panels.projectorSelect
            .on('change', () => {
                const v = this.pm.panels.projectorSelect.property('value');
                this.selectProjection(v);
            })


    }


}