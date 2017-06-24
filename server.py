#!/usr/bin/env python3

import argparse
import os
import connexion
import logging
import requests

from flask import send_from_directory, redirect, json
import numpy as np

__author__ = 'Hendrik Strobelt'

logging.basicConfig(level=logging.INFO)
app = connexion.App(__name__)


# just a simple flask route
@app.route('/')
def hello_world():
    return redirect('client/index.html')


# send everything from client as static content
@app.route('/client/<path:path>')
def send_static_client(path):
    """ serves all files from ./client/ to ``/client/<path:path>``

    :param path: path from api call
    """
    return send_from_directory('client/', path)


# send everything from client as static content
@app.route('/node_modules/<path:path>')
def send_static_dep(path):
    """ serves all files from ./node_modules/ 

    :param path: path from api call
    """
    return send_from_directory('node_modules/', path)


# ------ API routing as defined in swagger.yaml (connexion)
def get_translation(**request):
    inSentence = request['in']

    r = requests.post('http://127.0.0.1:7784/translator/translate', data=json.dumps([{"src": inSentence}]))

    # res: [[{'src': 'Hello World', 'tgt': 'Hallo Welt', 'pred_score': -0.1768690943718, 'attn': [[0.62342292070389,
    # 0.37657704949379], [0.16017833352089, 0.83982169628143]], 'n_best': 1}]]

    res = r.json()[0][0]

    attn = np.array(res['attn'])
    sorted_indices = np.argsort(attn, axis=1)

    for row_i in range(len(attn)):
        dec_order = sorted_indices[row_i][::-1]
        values = attn[row_i, dec_order]
        min_i = 0
        acc = 0.
        while acc < 0.75:
            acc += values[min_i]
            min_i += 1
        if min_i < len(values):
            attn[row_i, dec_order[min_i:]] = 0.

        print(attn[row_i], min_i)

    # print(attn, np.argsort(attn, axis=1)[::-1])

    return {
        'in': res['src'],
        'out': res['tgt'],
        'attn': attn.tolist(),
        'score': res['pred_score']
    }


app.add_api('swagger.yaml')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--nodebug", default=False)
    parser.add_argument("--port", default="8888")
    parser.add_argument("--nocache", default=False)
    parser.add_argument("-dir", type=str, default=os.path.abspath('data'))
    args = parser.parse_args()

    print(args)

    app.run(port=int(args.port), debug=not args.nodebug)
