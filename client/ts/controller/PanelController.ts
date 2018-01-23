import * as d3 from 'd3'
import * as _ from 'lodash';

import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {WordLine, WordLineHoverEvent} from "../vis/WordLine"
import {BarList} from "../vis/BarList";
import {StateVis} from "../vis/StateVis";
import {AttentionVis} from "../vis/AttentionVis";
import {WordProjector, WordProjectorClickedEvent} from "../vis/WordProjector";
import {CloseWordList} from "../vis/CloseWordList";
import {S2SApi, Translation} from "../api/S2SApi";
import {LooseObject} from "../etc/LocalTypes";
import {VComponent} from "../vis/VisualComponent";
import {PanelManager} from "./PanelManager";


export class PanelController {
    // private _columns: LooseObject;


    private eventHandler: SimpleEventHandler;
    private pm: PanelManager;
    private _current = {
        topN: 0,
        inWordPos: [],
        outWordPos: [],
        inWords: [],
        outWords: [],
    }

    constructor() {


        this.eventHandler = new SimpleEventHandler(<Element> d3.select('body').node());

        this.pm = new PanelManager(this.eventHandler);


        this._init();

        this._bindEvents();

    }

    _init() {


    }

    update(raw_data, main = this.pm.vis.left, extra = this.pm.vis.zero) {

        const cur = this._current;
        // const vis = this.pm.vis;


        const data = new Translation(raw_data, cur);
        data.filterAttention();
        const enc = main.encoder_words;
        const dec = main.decoder_words;

        enc.update(data);
        dec.update(data);

        cur.inWordPos = enc.positions[0];
        cur.inWords = enc.rows[0];
        cur.outWordPos = dec.positions[0];
        cur.outWords = dec.rows[0];
        data._current = cur;

        const attn = main.attention;
        attn.update(data);

        main.encoder_extra.forEach(e => e.update(data));
        main.decoder_extra.forEach(e => e.update(data));


        //==== setup column

        if (extra) {
            extra.decoder_words.update(data);

            extra.decoder_extra.forEach(d => {
                if ('updateOptions' in d) {
                    d.updateOptions({options: {xScale: extra.decoder_words.xScale}});
                    d.update(data);
                }

            })

        }


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
            if ((caller === vis.left.encoder_words) || _.includes(vis.left.encoder_extra, caller))
                return {vType: AttentionVis.VERTEX_TYPE.Encoder, col: vis.left};
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

                d.caller.highlightWord(d.row, d.index, d.selected, true,'selected');

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
            col.attention.highlightAllEdges(d.index, vType, d.hovered);
        }


        this.eventHandler.bind(WordLine.events.wordHovered, actionWordHovered)


        this.eventHandler.bind(WordProjector.events.wordClicked,
            (d: WordProjectorClickedEvent) => {

                S2SApi.translate({input: d.sentence}).then(data => {

                        const {main, extra} = this.pm.getMediumPanel();

                        const d = JSON.parse(data);

                        this.update(d, main, null);


                    }
                )


            })


    }


}