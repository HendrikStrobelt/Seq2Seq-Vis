import * as d3 from 'd3'

import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {WordLine, WordLineHoverEvent} from "../vis/WordLine"
import {AttentionVis, AttentionVisData} from "../vis/AttentionVis";
import {WordProjector, WordProjectorClickedEvent} from "../vis/WordProjector";
import {S2SApi, TrainDataIndexResponse} from "../api/S2SApi";
import {PanelManager} from "./PanelManager";
import {
    StateDesc,
    StateProjector,
    StateProjectorClickEvent, StateProjectorHoverEvent
} from "../vis/StateProjector";
import * as _ from 'lodash';
import {StatePictograms, StatePictogramsHovered} from "../vis/StatePictograms";
import {BeamTreeData, BeamTree} from "../vis/BeamTree";
import ModalDialog from "../etc/ModalDialog";
import {Translation} from "../api/Translation";


enum ComparisonMode {
    none, enc_diff, dec_dff
}

enum WordClickMode {
    word, attn
}

type ComparisonFeedBack = { in: any, compare: any, neighbors: any };

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
        sentence: null,
        translations: <Translation[]>[null, null],
        comparison: <ComparisonMode> ComparisonMode.none,
        wordClickMode: WordClickMode.word,
        attnChange: {
            selected: <number>-1,
            changes: <{ [key: number]: number }>{}//<{ [key: number]: { [key: number]: number } }>{}
        }
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
        // TODO: remove duck typing for encoder and src/tgt

        this.pm.setVisibilityNeighborPanels(true);

        this._current.projectedNeighbor = key;
        let labels = this._current.translations.map(
            translation => {
                if (translation == null) return [];
                // else:
                if (key.startsWith('enc')) return translation.encoderWords;
                else return translation.decoderWords[0];
            }
        );

        const getNeighborsFor = {
            'encoder': (trans: Translation) => trans.encoder.map(d => d.neighbors.map(dd => dd[0])),
            'decoder': (trans: Translation) => trans.decoder[0].map(d => d.neighbors.map(dd => dd[0])),
            'context': (trans: Translation) => trans.decoder[0].map(d => d.neighbor_context.map(dd => dd[0])),
        };

        let moreNeighbors = null;
        if (key in getNeighborsFor) {
            const getNeighbors = getNeighborsFor[key];
            moreNeighbors = this._current.translations.map(translation => {
                    if (translation == null) return [];
                    // else:
                    return getNeighbors(translation)
                }
            );
        }


        this.pm.vis.projectors.update({
            states: this._current.allNeighbors[key],
            loc: key.startsWith('enc') ? 'src' : 'tgt',
            labels,
            moreNeighbors
        });
        this.pm.vis.statePicto.update(null);
    }

    updateProjectorData(allNeighbors) {
        const cur = this._current;

        cur.allNeighbors = allNeighbors;

        if (allNeighbors) {
            const allNeighborKeys = Object.keys(allNeighbors);
            if (!cur.projectedNeighbor) cur.projectedNeighbor = (allNeighborKeys.indexOf('decoder') > -1) ? 'decoder' : allNeighborKeys[0];

            this.pm.panels.projectorSelect.style('display', null);
            this.pm.panels.loadProjectButton.style('display', 'none');
            this.pm.vis.statePicto.unhideView();
            this.pm.vis.projectors.unhideView();


            this.pm.updateProjectionSelectField(allNeighborKeys, cur.projectedNeighbor);

            this.selectProjection(cur.projectedNeighbor);


        } else {
            this.pm.panels.projectorSelect.style('display', 'none');
            this.pm.panels.loadProjectButton.style('display', null);

            this.pm.vis.statePicto.hideView();
            this.pm.vis.projectors.hideView();
        }

    }

    clearCompare() {
        this._current.translations[1] = null;
        this._current.comparison = ComparisonMode.none;
    }

    update(translation: Translation, main = this.pm.vis.left, extra = this.pm.vis.zero, isCompare = false) {

        const cur = this._current;


        //=== translation object with convenience functions
        // const translation = new Translation(raw_data);
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


        // main.encoder_states.update({
        //     row: translation.encoderNeighbors
        // });
        // main.decoder_states.update({
        //     row: translation.decoderNeighbors[cur.beamIndex]
        // });
        // main.context.update({
        //     row: translation.contextNeighbors[cur.beamIndex]
        // });


        if (isCompare) {
            cur.translations[1] = translation;
            main.sideIndicator.classed('side_compare', true)
                .text('compare');
        } else {
            cur.translations[0] = translation;
            main.sideIndicator.classed('side_pivot', true)
                .text('pivot');
            // if (main == this.pm.vis.left) {
            this._current.sentence = translation.inputSentence;
            this.updateProjectorData(translation.allNeighbors);


            const winnerBeam = translation.decoderWords[cur.beamIndex];

            const btWords: string[][][] = translation.beam_trace_words;
            // console.log(raw_data.beam_trace_words, "--- ");
            const allNodes: { [key: string]: BeamTree } = {};

            //TODO: This is a terrible hack :)
            const withStartToken = btWords[0][0][0] === '<s>';


            const root: BeamTree = {
                name: btWords[0][0][0],
                children: []
            };
            allNodes[btWords[0][0][0]] = root;

            for (const depthList of btWords.slice(withStartToken ? 1 : 0)) {
                for (const subBeam of depthList) {
                    const [nodeName] = subBeam.slice(-1);
                    const rootName = subBeam.slice(0, -1).join('||');
                    const nodeID = subBeam.join('||');

                    let topBeam = null;
                    if (withStartToken) {
                        topBeam = _.isEqual(subBeam.slice(1), winnerBeam.slice(0, subBeam.length - 1));
                    } else {
                        topBeam = _.isEqual(subBeam.slice(0), winnerBeam.slice(0, subBeam.length));
                    }

                    const node: BeamTree = {
                        name: nodeName,
                        children: [],
                        topBeam
                    };

                    if (!(nodeID in allNodes)) {
                        allNodes[rootName].children.push(node);
                        allNodes[nodeID] = node;
                    }

                }
            }


            this.pm.vis.beamView.update({root, maxDepth: btWords.length})

        }

        if ('beam' in main) {
            let beamWords: string[][] = [];
            let beamColors: string[][] = [];
            let beamValues: number[][] = [];
            const top_predict = translation.decoderWords[0];
            // console.log(top_predict, "--- top_predict");

            for (const j in _.range(translation.beam[0].length)) {
                const ro: string[] = [];
                const roCol: string[] = [];
                const bv: number[] = [];
                for (const i in translation.beam) {
                    const w = translation.beam[i][j].word;
                    ro.push(w);


                    if (w === top_predict[i]) {
                        roCol.push('#ccc2a3')
                    } else {
                        roCol.push(null)
                    }

                    bv.push(translation.beam[i][j].score)
                }
                beamWords.push(ro);
                beamColors.push(roCol);
                beamValues.push(bv);

            }

            const valBound = d3.extent(_.flatten(beamValues));
            const cScale = d3.scaleLinear<string>().domain(valBound)
                .range(['#fff', '#999']);
            const wordFill = beamValues.map(row => row.map(value => cScale(value)))

            const bwScale = d3.scaleLinear().domain(valBound).range([1, main.beam.options.box_width - 10]);
            const boxWidth = beamValues.map(row => row.map(value => bwScale(value)))


            main.beam.update({
                wordRows: beamWords,
                boxWidth,
                wordFill: beamColors
            })
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

    updateAndShowWordProjector(data, loc) {
        this.pm.setVisibilityNeighborPanels(false);
        const wp = this.pm.getWordProjector();
        console.log(data, "--- WP_data");
        wp.options.loc = loc;
        wp.update(data);
    }

    updateAndShowWordList(data) {
        const wl = this.pm.getWordList();
        wl.update(data);
    }


    updateProjectInfo(info) {

        if (!info.has_neighbors) {
            this.pm.panels.loadProjectButton.style('display', 'none');
        }
    }

    _bindEvents() {


        const vis = this.pm.vis;

        const determinePanelType = caller => {
            if ((caller === vis.left.encoder_words)) //_.includes(vis.left.encoder_extra, caller)
                return {
                    vType: AttentionVis.VERTEX_TYPE.src,
                    col: vis.left
                };
            else if ((caller === vis.middle.encoder_words))
                return {
                    vType: AttentionVis.VERTEX_TYPE.src,
                    col: vis.middle
                };
            else if ((caller === vis.middle.decoder_words))
                return {
                    vType: AttentionVis.VERTEX_TYPE.tgt,
                    col: vis.middle
                };
            else return {
                    vType: AttentionVis.VERTEX_TYPE.tgt,
                    col: vis.left
                };
        };


        const updateComparisonView = (d: ComparisonFeedBack) => {
            const {main, extra} = this.pm.getMediumPanel();

            // console.log(d, "--- d");
            this.update(new Translation(d.compare), main, null, true);

            this.updateProjectorData(d.neighbors);
        }

        const actionWordHovered = (d: WordLineHoverEvent) => {
            // console.log(d,"--- d");

            // return if decoder word is fixed
            if (this._current.wordClickMode === WordClickMode.attn &&
                this._current.attnChange.selected > -1) return;

            d.caller.actionHighlightWord(d.row, d.col, d.hovered);

            const {vType, col} = determinePanelType(d.caller);
            let transID = 0;
            if (col != this.pm.vis.left) {
                col.attention.actionHighlightEdges(d.col, vType, d.hovered);
                transID = 1;
            }
            this.pm.vis.left.attention.actionHighlightEdges(d.col, vType, d.hovered);


            const proj = this.pm.vis.projectors;
            const pictos = this.pm.vis.statePicto;

            if (proj.current.hidden === false) {
                if (vType === AttentionVis.VERTEX_TYPE.src &&
                    proj.loc === 'src') {

                    proj.actionHoverPivot(transID, d.col, d.hovered);
                    pictos.actionHighlightSegment(transID, d.col, d.hovered);

                }
                else if (vType === AttentionVis.VERTEX_TYPE.tgt &&
                    proj.loc === 'tgt') {

                    proj.actionHoverPivot(transID, d.col, d.hovered);
                    pictos.actionHighlightSegment(transID, d.col, d.hovered);

                }
            }


        };

        this.eventHandler.bind(WordLine.events.wordHovered, actionWordHovered);


        const openWordCloud = ({input, loc, limit, allWords, replaceIndex}) => {
            this.cleanPanels();
            S2SApi.closeWords({input, loc, limit})
                .then(data => {


                    const word_data = JSON.parse(data);
                    // this.updateAndShowWordProjector(word_data);
                    // if (loc === 'src') {
                    //     const pivot = allWords.join(' ');
                    //
                    //     const compare = word_data.word.map(wd => {
                    //         return allWords.map((aw, wi) =>
                    //             (wi === replaceIndex) ? wd : aw).join(' ');
                    //     })
                    //
                    //     S2SApi.compareTranslation({pivot, compare})
                    //         .then(data => {
                    //             word_data["compare"] = JSON.parse(data)["compare"];
                    //             // this.updateAndShowWordList(word_data);
                    //             this.updateAndShowWordProjector(word_data);
                    //         })
                    //
                    // } else {
                    // this.updateAndShowWordList(word_data);

                    if (loc === 'src') {
                        word_data.compare = word_data.word.map(wd => {

                            return {
                                orig: allWords.map((aw, wi) =>
                                    (wi === replaceIndex) ? wd : aw).join(' ')
                            };
                        })
                        // word_data.compare = {orig: }
                    } else {
                        word_data.compare = word_data.word.map(wd => {

                            return {
                                orig: allWords.map((aw, wi) =>
                                    (wi === replaceIndex) ? wd : (wi < replaceIndex) ? aw : '').join(' ').trim()
                            };
                        })
                    }
                    this.updateAndShowWordProjector(word_data, loc);
                    // }


                })
                .catch(error => console.log(error, "--- error"));

        }


        this.eventHandler.bind(WordLine.events.wordSelected, (d: WordLineHoverEvent, e) => {
            if (d.caller === vis.left.encoder_words
                || d.caller === vis.left.decoder_words) {

                let loc = 'src';
                let vType = AttentionVis.VERTEX_TYPE.src;
                if (d.caller === vis.left.decoder_words) {
                    loc = 'tgt';
                    vType = AttentionVis.VERTEX_TYPE.tgt;
                }


                if (this._current.wordClickMode === WordClickMode.word) {
                    d.caller.actionHighlightWord(d.row, d.col, d.hovered, true, 'selected');
                    openWordCloud({
                        input: d.word.word.text,
                        loc,
                        limit: 20,
                        allWords: d.caller.firstRowPlainWords,
                        replaceIndex: d.col
                    })

                } else if (this._current.wordClickMode === WordClickMode.attn) {
                    const aChg = this._current.attnChange;
                    if (loc === 'tgt') {
                        if (aChg.selected != d.col) {
                            aChg.selected = d.col;
                            d.caller.actionHighlightWord(d.row, d.col, true, true, 'selected');
                            this.pm.vis.left.attention
                                .actionHighlightEdges(d.col, vType, true, 'highlight');
                        } else {
                            aChg.selected = -1;
                            d.caller.actionHighlightWord(d.row, d.col, false, true, 'selected');
                            this.pm.vis.left.attention
                                .actionHighlightEdges(d.col, vType, false, 'highlight');
                        }

                    }

                    if (loc === 'src') {
                        if (aChg.selected > -1) {
                            const a = this._current.translations[0]
                                .increaseAttn(aChg.selected, d.col);

                            aChg.changes[aChg.selected] = _.indexOf(a, _.max(a));

                            this.pm.panels.wordMode.attnApplyBtn.style('display', null);

                            console.log(a, aChg.selected, d.col, "--- a, aChg.selected, d.col");

                            this.update(this._current.translations[0]);
                            this.pm.vis.left.decoder_words.actionHighlightWord(0, aChg.selected, true, true, 'selected');
                            this.pm.vis.left.attention
                                .actionHighlightEdges(aChg.selected, AttentionVis.VERTEX_TYPE.tgt, true, 'highlight');


                        } else {
                            alert('Please select a decoder word first. ' +
                                'Then you can increase respective weights by clicking on encoder');
                        }
                    }


                }


            }


            else if (d.caller === vis.left.beam) {


                const partialDec = this._current.translations[0]
                    .decoderWords[0].slice(0, d.col).join(' ') + ' ' + d.word.word.text;


                this.pm.closeAllRight();
                S2SApi.translate(
                    {
                        input: this._current.translations[0].inputSentence,
                        partial: [partialDec],
                        neighbors: []
                    }).then(data => {
                    data = JSON.parse(data);
                    console.log(data, "--- data");

                    this.update(new Translation(data));
                    actionWordHovered(d);

                })
                // .map((w, i) => (i === d.col) ? d.word.word.text : w)
            }


        });


        this.pm.panels.wordMode.attnApplyBtn.on('click', () => {

            this.pm.panels.wordMode.attnApplyBtn.style('display', 'none');

            const minIndex = _.min(Object.keys(this._current.attnChange.changes).map(d => +d));
            const partialDec = this._current.translations[0]
                .decoderWords[0].slice(0, minIndex).join(' ')


            S2SApi.translate(
                {
                    input: this._current.translations[0].inputSentence,
                    partial: [partialDec],
                    neighbors: [],
                    force_attn: this._current.attnChange.changes
                }).then(data => {
                data = JSON.parse(data);
                console.log(data, "--- data");

                this.update(new Translation(data));
            })


        });


        this.eventHandler.bind(WordProjector.events.wordClicked,
            (d: WordProjectorClickedEvent) => {

                d.caller.highlightWord(d.word, true,
                    true, 'selected');

                const loc = d.caller.options.loc;


                if (loc === 'src') {
                    S2SApi.translate_compare({
                        input: this._current.sentence,
                        compare: d.sentence,
                        neighbors: []
                    }).then(data => {
                        // TODO: ENC / DEC difference !!!
                        this._current.comparison = ComparisonMode.enc_diff;
                        data = <ComparisonFeedBack>JSON.parse(data);
                        updateComparisonView(data)
                    })

                } else {
                    S2SApi.translate({
                        input: this._current.sentence,
                        // compare: d.sentence,
                        partial: [d.sentence],
                        neighbors: []
                    }).then(data => {
                        // TODO: ENC / DEC difference !!!
                        this._current.comparison = ComparisonMode.none;
                        data = new Translation(JSON.parse(data));
                        this.update(data)
                    })
                }


            });

        this.eventHandler.bind(StateProjector.events.clicked,
            (d: StateProjectorClickEvent) => {
                d.caller.actionSelectPoints(d.pointIDs);

                S2SApi.trainDataIndices(d.neighborIDs, d.loc).then(data => {
                    const raw_data = <TrainDataIndexResponse> JSON.parse(data);

                    this.pm.getInfoPanel().update({
                        translations: raw_data.res.map(d => ({
                            src: d.src_words,
                            tgt: d.tgt_words
                        })),
                        highlights: {
                            loc: raw_data.loc,
                            indices: raw_data.res.map(d => d.tokenId)
                        }
                    });
                })

            })


        const projectHovered = (loc: string, transID: number,
                                wordID: number, hovered: boolean) => {
            const panels = [this.pm.vis.left, this.pm.vis.middle];

            let vType = AttentionVis.VERTEX_TYPE.src;

            const visRoot = panels[transID];
            if (loc === 'src') {
                visRoot.encoder_words.actionHighlightWord(0, wordID, hovered)
            } else {
                vType = AttentionVis.VERTEX_TYPE.tgt;
                visRoot.decoder_words.actionHighlightWord(0, wordID, hovered)
            }

            for (const tID in _.range(transID + 1)) {
                const visRoot = panels[tID];
                visRoot.attention.actionHighlightEdges(wordID, vType, hovered);
            }

            // shouldn't happen when views are hidden:
            this.pm.vis.projectors.actionHoverPivot(transID, wordID, hovered);
            this.pm.vis.statePicto.actionHighlightSegment(transID, wordID, hovered)


        }


        this.eventHandler.bind(StateProjector.events.hovered,
            (d: StateProjectorHoverEvent) => {
                projectHovered(d.loc, d.transID, d.wordID, d.hovered);

            });

        this.eventHandler.bind(StatePictograms.events.segmentHovered,
            (d: StatePictogramsHovered) => {
                const seg = d.segment;
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

        this.pm.panels.loadProjectButton.on('click', () => {

            this.pm.panels.loadProjectSpinner.style('display', 'inline');

            this.cleanPanels();

            if (this._current.comparison === ComparisonMode.enc_diff) {
                // then we are in compare mode
                S2SApi.translate_compare({
                    input: this._current.translations[0].inputSentence,
                    compare: this._current.translations[1].inputSentence
                }).then(data => {
                    // TODO: ENC / DEC difference !!!
                    this._current.comparison = ComparisonMode.enc_diff;
                    data = <ComparisonFeedBack>JSON.parse(data);

                    this.pm.panels.loadProjectSpinner.style('display', 'none');
                    this.update(new Translation(data.in));
                    updateComparisonView(data)
                })


            } else if (this._current.comparison === ComparisonMode.none) {
                // here in single mode
                S2SApi.translate({input: this._current.sentence})
                    .then((data: string) => {
                        const raw_data = JSON.parse(data);
                        console.log(raw_data, "--- raw_data");

                        this.pm.panels.loadProjectSpinner.style('display', 'none');
                        this.update(new Translation(raw_data));
                    })
            }


        })

        this.pm.panels.projectorSelect
            .on('change', () => {
                const v = this.pm.panels.projectorSelect.property('value');
                this.selectProjection(v);
            });


        const ec = this.pm.panels.enterComparison;

        ec.btn.on('click', () => {
            const t = this._current.translations[0];
            ModalDialog.open(ec.dialog, this.eventHandler, 400);
            ec.enc.property('value', t.inputSentence);
            ec.dec.property('value', t.decoderWords[0].join(' '));
        })


        ec.encBtn.on('click', () => {
            const inSentence = ec.enc.property('value').trim();
            S2SApi.translate_compare({
                input: this._current.sentence,
                compare: inSentence,
                neighbors: []
            }).then(data => {
                // TODO: ENC / DEC difference !!!
                this._current.comparison = ComparisonMode.enc_diff;
                data = <ComparisonFeedBack>JSON.parse(data);
                updateComparisonView(data)
            })

            ModalDialog.close(ec.dialog);

        })

        ec.decBtn.on('click', () => {
            const inSentence = (<string> ec.dec.property('value')).trim();
            S2SApi.translate(
                {
                    input: this._current.translations[0].inputSentence,
                    partial: [inSentence],
                    neighbors: []
                }).then(data => {
                this._current.comparison = ComparisonMode.enc_diff;
                data = JSON.parse(data);

                // TODO: make nice and work with updateCOmparisonVoew
                const {main, extra} = this.pm.getMediumPanel();
                this.update(new Translation(data), main, null, true);

                // this.updateProjectorData(data.neighbors);
            })

            ModalDialog.close(ec.dialog);

        })


        this.pm.panels.swapBtn.on('click', () => {
            if (!this._current.translations[1]) return;
            const comp = this._current.translations[1];
            const pivot = this._current.translations[0];

            this.update(comp);
            const {main, extra} = this.pm.getMediumPanel();
            this.update(pivot, main, null, true);

        });


        this.pm.panels.wordMode.attnBtn.on('click', () => {
            this.pm.panels.wordMode.attnBtn.classed('selected', true);
            this.pm.panels.wordMode.wordBtn.classed('selected', false);
            this._current.wordClickMode = WordClickMode.attn
        });

        this.pm.panels.wordMode.wordBtn.on('click', () => {
            this.pm.panels.wordMode.attnBtn.classed('selected', false);
            this.pm.panels.wordMode.wordBtn.classed('selected', true);
            this._current.wordClickMode = WordClickMode.word
        });


    }


}