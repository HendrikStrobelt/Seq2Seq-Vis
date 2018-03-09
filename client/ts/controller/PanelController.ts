import * as d3 from 'd3'

import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {WordLine, WordLineHoverEvent} from "../vis/WordLine"
import {AttentionVis, AttentionVisData} from "../vis/AttentionVis";
import {WordProjector, WordProjectorClickedEvent} from "../vis/WordProjector";
import {S2SApi, TrainDataIndexResponse, Translation} from "../api/S2SApi";
import {PanelManager} from "./PanelManager";
import {StateDesc, StateProjector} from "../vis/StateProjector";


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

    updateProjectorSelection(key) {
        this._current.projectedNeighbor = key;
        this.pm.vis.projectors.update({
            states: this._current.allNeighbors[key],
            loc: key
        });
    }

    updateProjectorData(allNeighbors) {
        const cur = this._current;

        cur.allNeighbors = allNeighbors;

        const allNeighborKeys = Object.keys(allNeighbors);
        if (!cur.projectedNeighbor) cur.projectedNeighbor = allNeighborKeys[0];

        this.pm.setProjectorOptions(allNeighborKeys, cur.projectedNeighbor);

        this.updateProjectorSelection(cur.projectedNeighbor);
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
                return {vType: AttentionVis.VERTEX_TYPE.Encoder, col: vis.left};
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
            if (col != this.pm.vis.left) {
                col.attention.actionHighlightEdges(d.index, vType, d.hovered);
            }
            this.pm.vis.left.attention.actionHighlightEdges(d.index, vType, d.hovered);

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
            (d: { loc: string, d: number[] }) => {
                console.log(d, "--- d");

                S2SApi.trainDataIndices(d.d, d.loc).then(data => {
                    const raw_data = <TrainDataIndexResponse> JSON.parse(data);

                    // const res = raw_data.res;
                    this.pm.getInfoPanel().setTrans(raw_data.res);

                    console.log(raw_data, "--- data");
                })

            })


        this.pm.panels.projectorSelect
            .on('change', () => {
                const v = this.pm.panels.projectorSelect.property('value');
                this.updateProjectorSelection(v);
            })


    }


}