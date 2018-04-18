import {Networking} from "../etc/Networking";

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

    // static compareTranslation({pivot, compare}) {
    //     const request = Networking.ajax_request('/api/compare_translation');
    //     const payload = new Map([
    //         ['in', pivot],
    //         ['compare', compare.join('|')]]);
    //
    //     return request
    //         .get(payload)
    // }

    static trainDataIndices(indices: number[], loc: string) {
        //http://0.0.0.0:8080/api/train_data_for_index?indices=123%2C333&loc=src
        const request = Networking.ajax_request('/api/train_data_for_index');
        const payload = new Map([['indices', indices.join(',')],
            ['loc', loc]]);

        return request
            .get(payload)


    }

}


