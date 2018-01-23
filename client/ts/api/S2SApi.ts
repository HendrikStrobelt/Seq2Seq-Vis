import {Networking} from "../etc/Networking";
import {LooseObject} from "../etc/LocalTypes";

export class S2SApi {


    static translate({input}) {
        const request = Networking.ajax_request('/api/translate');
        const payload = new Map([['in', input]]);

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
            ['compare', compare]]);

        return request
            .get(payload)
    }


}


export class Translation {

    private readonly _result: {
        attn:number[][][],
        attnFiltered:number[][][],
        scores:number[],
        decoder: {state:number[], token:string}[][],
        encoder: {state:number[], token:string}[],
        [key: string]: any
    } = null;

    public _current:LooseObject;

    constructor(result, current) {
        this._result = result;
        this._current = current;
    }

    get result() {
        return this._result;
    }

    get attn(){
        return this._result.attn;
    }

    get attnFiltered() {
        return this._result.attnFiltered;
    }

    get encoder() {
        return this._result.encoder;
    }

    get decoder() {
        return this._result.decoder;
    }

    get scores(){
        return this._result.scores;
    }

}