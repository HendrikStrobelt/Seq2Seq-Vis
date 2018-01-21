/**
 * Created by hen on 5/15/17.
 */
export class Networking {

    /**
     * Generates a Ajax Request object.
     * @param {string} url - the base url
     * @returns {{get: (function(*=)), post: (function(*=)), put: (function(*=)), delete: (function(*=))}}
     *  the ajax object that can call get, post, put, delete on the url
     */
    static ajax_request(url): { get, post, put, delete } {

        /* Adapted from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
         * EXAMPLE:

         var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
         var payload = {
         'topic' : 'js',
         'q'     : 'Promise'
         };

         var callback = {
         success: function(data) {
         console.log(1, 'success', JSON.parse(data));
         },
         error: function(data) {
         console.log(2, 'error', JSON.parse(data));
         }
         };

         // Executes the method call
         $http(mdnAPI)
         .get(payload)
         .then(callback.success)
         .catch(callback.error);

         // Executes the method call but an alternative way (1) to handle Promise Reject case
         $http(mdnAPI)
         .get(payload)
         .then(callback.success, callback.error);

         */

        // Method that performs the ajax request
        const ajax = (method, _url, args) => {

            // Creating a promise
            return new Promise((resolve, reject) => {

                // Instantiates the XMLHttpRequest
                const client = new XMLHttpRequest();
                let uri = _url;

                if (args && (method === 'POST' || method === 'GET' || method === 'PUT')) {
                    uri += '?';
                    args.forEach((value, key) => {
                            uri += '&';
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                        }
                    )
                }

                // Debug: console.log('URI', uri, args);
                client.open(method, uri);
                client.send();
                client.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        // Performs the function "resolve" when this.status is equal to 2xx
                        resolve(this.response);
                    } else {
                        // Performs the function "reject" when this.status is different than 2xx
                        reject(this.statusText);
                    }
                };
                client.onerror = function () {
                    reject(this.statusText);
                };
            });

        };

        // Adapter pattern
        return {
            'get': args => ajax('GET', url, args),
            'post': args => ajax('POST', url, args),
            'put': args => ajax('PUT', url, args),
            'delete': args => ajax('DELETE', url, args)
        };


    }
}