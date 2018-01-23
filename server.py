#!/usr/bin/env python3

import argparse
import os
import connexion
import logging
import requests

from flask import send_from_directory, redirect, json
import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import MDS, TSNE

from model_api.onmt_lua_model_api import ONMTLuaModelAPI
from model_api.opennmt_model import ONMTmodelAPI
from s2s.project import S2SProject

__author__ = 'Hendrik Strobelt, Sebastian Gehrmann'
CONFIG_FILE_NAME = 's2s.yaml'
projects = {}

logging.basicConfig(level=logging.INFO)
app = connexion.App(__name__)

parser = argparse.ArgumentParser()
parser.add_argument("--nodebug", default=True)
parser.add_argument("--port", default="8080")
parser.add_argument("--nocache", default=False)
parser.add_argument("-dir", type=str, default=os.path.abspath('model_api/data'))
parser.add_argument('-api', type=str, default='pytorch',
                    choices=['pytorch', 'lua'],
                    help="""The API to use.""")
args = parser.parse_args()

print(args)


# global model
# if args.api == "pytorch":
#     # model = ONMTmodelAPI("model_api/data/ende_acc_15.72_ppl_912.74_e9.pt")
#     model = ONMTmodelAPI("model_api/data/ende_acc_46.86_ppl_21.19_e12.pt")
# else:
#     model = ONMTLuaModelAPI()


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
    current_project = list(projects.values())[0]
    model = current_project.model

    in_sentence = request['in']
    translate = model.translate(in_text=[in_sentence])[0]
    print("_".join(map(lambda x: x['token'], translate["decoder"][0])))
    # r = requests.post('http://127.0.0.1:7784/translator/translate', data=json.dumps([{"src": inSentence}]))
    #
    # # res: [[{'src': 'Hello World', 'tgt': 'Hallo Welt', 'pred_score': -0.1768690943718, 'attn': [[0.62342292070389,
    # # 0.37657704949379], [0.16017833352089, 0.83982169628143]], 'n_best': 1}]]
    #
    # res = r.json()[0][0]
    #
    a_f = []

    return translate


def extract_sentence(x): return ' '.join(
    map(lambda y: y['token'], x['decoder'][0]))


def extract_attn(x): return np.array(x['attn'][0])


def compare_translation(**request):
    pivot = request["in"]
    compare = request["compare"]

    current_project = list(projects.values())[0]
    model = current_project.model

    # trans_all = model.translate(in_text=[pivot]+compare)

    pivot_res = model.translate(in_text=[pivot])[0]
    pivot_attn = extract_attn(pivot_res)
    pivot_attn_l = pivot_attn.shape[0]

    # compare.append(pivot)
    compare_t = model.translate(in_text=compare)

    res = []
    index_orig = 0
    for cc_t_key in compare_t:
        # cc_t = model.translate(in_text=[cc])[0]
        cc_t = compare_t[cc_t_key]
        cc_attn = extract_attn(cc_t)
        dist = 10
        if cc_attn.shape[0] > 0:
            max_0 = max(cc_attn.shape[0], pivot_attn.shape[0])
            max_1 = max(cc_attn.shape[1], pivot_attn.shape[1])

            cc__a = np.zeros(shape=(max_0, max_1))
            cc__a[:cc_attn.shape[0], :cc_attn.shape[1]] = cc_attn

            cc__b = np.zeros(shape=(max_0, max_1))
            cc__b[:pivot_attn.shape[0], :pivot_attn.shape[1]] = pivot_attn

            dist = np.linalg.norm(cc__a - cc__b)

        res.append({
            "sentence": extract_sentence(cc_t),
            "attn": extract_attn(cc_t).tolist(),
            "attn_padding": (cc__a - cc__b).tolist(),
            "orig": compare[index_orig],
            "dist": dist
        })
        index_orig += 1

    return {"compare": res, "pivot": extract_sentence(pivot_res)}


P_METHODS = {
    "pca": PCA(n_components=2),
    "mds": MDS(),
    "tsne": TSNE(),
    "none": lambda x: x
}


def get_close_words(**request):
    current_project = list(projects.values())[0]  # type: S2SProject
    loc = request['loc']  # "src" or "tgt"
    limit = request['limit']
    p_method = request["p_method"]
    t2i = current_project.dicts['t2i'][loc]
    i2t = current_project.dicts['i2t'][loc]

    if loc == 'src':
        embeddings = current_project.embeddings['encoder']  # TODO: change !!
    else:
        embeddings = current_project.embeddings['decoder']

    word = request['in']

    my_vec = embeddings[t2i[word]]

    matrix = embeddings[:]
    matrix_norms = current_project.cached_norm(loc, matrix)

    dotted = matrix.dot(my_vec)

    vector_norm = np.sqrt(np.sum(my_vec * my_vec))
    matrix_vector_norms = np.multiply(matrix_norms, vector_norm)
    neighbors = np.divide(dotted, matrix_vector_norms)

    neighbour_ids = np.argsort(neighbors)[-limit:].tolist()

    names = [i2t[x] for x in neighbour_ids]

    # projection methods: MDS, PCA, tSNE -- all with standard params
    positions = []
    if p_method != "none":
        positions = P_METHODS[p_method].fit_transform(matrix[neighbour_ids, :])

    return {'word': names,
            # 'word_vector': matrix[neighbour_ids, :].tolist(),
            'score': neighbors[neighbour_ids].tolist(),
            'pos': positions.tolist()
            }


def find_and_load_project(directory):
    """
    searches for CONFIG_FILE_NAME in all subdirectories of directory
    and creates data handlers for all of them

    :param directory: scan directory
    :return: null
    """
    project_dirs = []
    for root, dirs, files in os.walk(directory):
        if CONFIG_FILE_NAME in files:
            project_dirs.append(os.path.abspath(root))

    i = 0
    for p_dir in project_dirs:
        dh_id = os.path.split(p_dir)[1]
        cf = os.path.join(p_dir, CONFIG_FILE_NAME)
        p = S2SProject(directory=p_dir, config_file=cf)
        projects[dh_id] = p

        i += 1


app.add_api('swagger.yaml')

if __name__ == '__main__':
    args = parser.parse_args()
    app.run(port=int(args.port), debug=not args.nodebug, host="0.0.0.0")
else:
    args, _ = parser.parse_known_args()
    find_and_load_project(args.dir)
