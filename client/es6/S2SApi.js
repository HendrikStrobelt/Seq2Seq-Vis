class S2SApi {


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