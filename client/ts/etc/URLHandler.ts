/**
 * Created by hen on 5/15/17.
 */

export class URLHandler {

    static basicURL() {
        const url_path = window.location.pathname.split('/').slice(0, -2).join('/');

        return window.location.origin + (url_path.length ? url_path : '');
    }

    /**
     * Read all URL parameters into a map.
     * @returns {Map} the url parameters as a key-value store (ES6 map)
     */
    static parameters() {
        // Adapted from:  http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
        const query = window.location.search.substring(1);
        const vars = query.split('&');

        const urlParameters = new Map();

        const isInt = x => (/^[0-9]+$/).test(x);
        const isFloat = x => (/^[0-9]+\.[0-9]*$/).test(x);

        vars.forEach(v => {
            if (v.length > 0) {
                const splits = v.split('=');
                const key = decodeURIComponent(splits[0]);
                let raw_value = decodeURIComponent(splits[1]);

                const isArray = raw_value.startsWith('..');
                if (isArray) {
                    raw_value = raw_value.slice(2);
                }

                if (raw_value.length < 1) {
                    urlParameters.set(key, isArray ? [] : '');
                } else {
                    const [first, ...rest] = raw_value.split(',').map(val => {
                        if (isInt(val)) {
                            return Number.parseInt(val, 10);
                        } else if (isFloat(val)) {
                            return Number.parseFloat(val);
                        }

                        return val;
                    });
                    urlParameters.set(key, isArray ? [first, ...rest] : first);
                }
            }
        });

        return urlParameters;

    }

    /**
     * updates the 'urlParameters' with the current values from URL
     * @param urlParameters
     */
    static updateParameters(urlParameters) {
        const currentParams = URLHandler.parameters();
        currentParams.forEach((v, k) => urlParameters.set(k, v));
    }


    /**
     * Generates an URL string from a map of url parameters
     * @param {Map} urlParameters - the map of parameters
     * @returns {string} - an URI string
     */
    static urlString(urlParameters) {
        const attr = [];
        urlParameters.forEach((v, k) => {
            if (v != undefined) {
                let value = v;
                if (Array.isArray(v)) value = '..' + v.join(',');
                attr.push(encodeURI(k + '=' + value))
            }
        });


        const url = window.location.pathname;
        let res = url.substring(url.lastIndexOf('/') + 1);
        if (attr.length > 0) {
            res += '?' + attr.join('&')
        }

        return res;
    }

    static setURLParam({key, value, addToBrowserHistory = true}) {
        const currentParams = URLHandler.parameters();
        currentParams.set(key, value);
        URLHandler.updateUrl({urlParameters: currentParams, addToBrowserHistory})
    }

    static updateUrl({urlParameters, addToBrowserHistory = true}) {
        if (addToBrowserHistory) {
            window.history.pushState(urlParameters, '',
              URLHandler.urlString(urlParameters))
        } else {
            window.history.replaceState(urlParameters, '',
              URLHandler.urlString(urlParameters))
        }
    }

}