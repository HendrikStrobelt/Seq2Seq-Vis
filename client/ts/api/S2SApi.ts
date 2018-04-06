import {Networking} from "../etc/Networking";
import {LooseObject} from "../etc/LocalTypes";
import {WordLineData} from "../vis/WordLine";
import {AttentionVisData} from "../vis/AttentionVis";
import * as _ from "lodash";

export type TrainDataIndexResponse = {
    ids: number[],
    loc: string,
    res: {
        attn: number[][], src: string, tgt: string,
        src_words: string[], tgt_words: string[],
        tokenId: number, sentId: number
    }[]

}


export class S2SApi {


    static translate({
                         input, partial = <string[]>[],force_attn = <{[key:number]:number}>{},
                         neighbors: neighbors = ['decoder', 'encoder'] //, 'context'
                     }) {
        const request = Networking.ajax_request('/api/translate');

        let force_attn_array = null;
        for (const key in force_attn){
            if (!force_attn_array) force_attn_array=[];
            force_attn_array.push(key);
            force_attn_array.push(force_attn[key]);
        }

        const payload = new Map([['in', input],
            ['neighbors', neighbors],
            ['partial', partial],
            ['force_attn', force_attn_array]
        ]);

        return request.get(payload)
    }

    static translate_compare({
                                 input, compare,
                                 neighbors = ['decoder', 'encoder'] //, 'context'
                             }) {
        const request = Networking.ajax_request('/api/translate_compare');
        const payload = new Map([
            ['in', input],
            ['compare', compare],
            ['neighbors', neighbors]]);

        return request.get(payload)
    }

    static closeWords({input, limit = 50, loc = 'src'}) {
        const request = Networking.ajax_request('/api/close_words');
        const payload = new Map([
            ['in', input],
            ['loc', loc],
            ['limit', limit]]);

        return request
            .get(payload)
    }

    static compareTranslation({pivot, compare}) {
        const request = Networking.ajax_request('/api/compare_translation');
        const payload = new Map([
            ['in', pivot],
            ['compare', compare.join('|')]]);

        return request
            .get(payload)
    }

    static trainDataIndices(indices: number[], loc: string) {
        //http://0.0.0.0:8080/api/train_data_for_index?indices=123%2C333&loc=src
        const request = Networking.ajax_request('/api/train_data_for_index');
        const payload = new Map([['indices', indices.join(',')],
            ['loc', loc]]);

        return request
            .get(payload)


    }

}


export class Translation {

    private readonly _result: {
        attn: number[][][],
        attnFiltered: number[][][],
        scores: number[],
        decoder: {
            neighbors: number[][],
            neighbor_context: number[][],
            state: number[],
            token: string
        }[][],
        encoder: {
            neighbors: number[][],
            state: number[],
            token: string
        }[],
        [key: string]: any
    } = null;

    public _current: LooseObject;

    private attention_save = null;

    constructor(result) {
        this._result = result;
        this.attention_save = _.cloneDeep(this.attn);
    }


    public increaseAttn(decPos, encPos, beam = 0, factor = .1) {

        const curAttn = this._result.attn[beam][decPos];
        const l = curAttn.length;

        const cost = _.sum(curAttn)- curAttn[encPos];

        for (const i in _.range(l)) {

            if (i == encPos) {
                console.log("-hen-- encPOS ");
                curAttn[i] += factor
            } else {
                curAttn[i] -= curAttn[i]*factor / cost;
                curAttn[i] = Math.max(curAttn[i], 0);
            }
        }

        this.filterAttention();

        return curAttn;
    }

    public resetAttn(decPos, beam = 0) {
        this._result.attn[beam][decPos] = this.attention_save[beam][decPos];
    }


    public filterAttention(threshold = .75) {

        if (this._result.attn.length > 0) {

            const res = [];

            for (const topSentence of this._result.attn) {
                const newSentence = [];
                for (const row of topSentence) {
                    const sortedValues = row.map((v, i) => [v, i])
                        .sort((a, b) => b[0] - a[0]);
                    const newRow = new Array(row.length).fill(0);
                    let acc = 0;
                    let index = 0;
                    while (acc < threshold && index < row.length) {
                        const v = sortedValues[index][0];
                        newRow[sortedValues[index][1]] = v;
                        acc += v;
                        index++;
                    }
                    newSentence.push(newRow)
                }
                res.push(newSentence)
            }
            this._result.attnFiltered = res;
            return true;

        } else return false;

    }


    get encoderWords(): string[] {
        return this._result.encoder.map(w => w.token);
    }

    get inputSentence(): string {
        return this.encoderWords.join(' ')
    }

    get decoderWords(): string[][] {
        return this._result.decoder.map(
            deco => deco.map(
                w => w.token))
    }


    get allNeighbors() {
        return this._result.allNeighbors;
    }

    get beam_trace_words() {
        return this._result.beam_trace_words;
    }

    get beam() {
        return this._result.beam;
    }

    get result() {
        return this._result;
    }

    get attn() {
        return this._result.attn;
    }

    get attnFiltered() {
        return this._result.attnFiltered;
    }

    get encoder() {
        return this._result.encoder;
    }

    get encoderNeighbors() {
        return this._result.encoder.map(d => d.neighbors)
    }

    get decoder() {
        return this._result.decoder;
    }

    get decoderNeighbors() {
        return this._result.decoder.map(dec =>
            dec.map(d => d.neighbors))
    }

    get contextNeighbors() {
        return this._result.decoder.map(dec =>
            dec.map(d => d.neighbor_context))
    }

    get scores() {
        return this._result.scores;
    }

}