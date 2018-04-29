import {LooseObject} from "../etc/LocalTypes";
import {cloneDeep, range, sum} from "lodash";

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
        this.attention_save = cloneDeep(this.attn);
    }


    public increaseAttn(decPos, encPos, beam = 0, factor = .1) {

        const curAttn = this._result.attn[beam][decPos];
        const l = curAttn.length;

        const cost = sum(curAttn) - curAttn[encPos];

        for (const i in range(l)) {

            if (i == encPos) {
                curAttn[i] += factor
            } else {
                curAttn[i] -= curAttn[i] * factor / cost;
                curAttn[i] = Math.max(curAttn[i], 0);
            }
        }

        this.filterAttention();

        return curAttn;
    }

    public setAttn(decPos, encPos, beam = 0) {
        const curAttn = this._result.attn[beam][decPos];
        const l = curAttn.length;

        for (const i in range(l)) {

            if (i == encPos) {
                console.log("-hen-- encPOS ");
                curAttn[i] = 1
            } else {
                curAttn[i] = 0
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
