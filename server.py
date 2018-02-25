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
import umap

from model_api.onmt_lua_model_api import ONMTLuaModelAPI
from model_api.opennmt_model import ONMTmodelAPI
from s2s.project import S2SProject
from s2s.vectorIndex import VectorIndex

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


def closest_vector(index, v, r=5):
    res = index.get_closest(v, k=20,
                            ignore_same_tgt=False,
                            include_distances=True,
                            use_vectors=True)

    if r > 1:
        res = [(xx[0], round(xx[1], r)) for xx in res]

    return res


def all_neighbors(project, translations, neighbors, p_method='tsne'):
    pca = P_METHODS[p_method]
    # pca = umap.UMAP()#TSNE(n_components=2)

    res = {}
    for neighborhood in neighbors:
        n_cand = [[]]
        states = []
        nb_summary = {}
        for t_id, translation in translations.items():
            index = project.get_index(neighborhood)

            if index:
                if neighborhood == 'encoder':
                    states.append(
                        map(lambda x: x['state'], translation['encoder']))
                    for e_id, enc in enumerate(translation['encoder']):
                        n_cand_local = closest_vector(index, enc['state'])
                        enc['neighbors'] = n_cand_local
                        n_cand[0].append(
                            {'i': e_id, 't': t_id, 'type': 'enc',
                             'n': n_cand_local})

                if neighborhood == 'decoder':
                    states.append(map(lambda x: x['state'],
                                      translation['decoder'][0]))
                    bId = 0
                    for beam in translation['decoder']:
                        for d_id, dec in enumerate(beam):
                            n_cand_local = closest_vector(index,
                                                          dec['state'])
                            dec['neighbors'] = n_cand_local
                            if bId == 0:
                                n_cand[0].append(
                                    {'i': d_id, 't': t_id, 'type': 'dec',
                                     'n': n_cand_local})

                        bId += 1
                if neighborhood == 'context':
                    states.append(map(lambda x: x['context'],
                                      translation['decoder'][0]))
                    bId = 0
                    for beam in translation['decoder']:
                        for d_id, dec in enumerate(beam):
                            n_cand_local = closest_vector(index,
                                                          dec['context'])
                            dec['neighbor_context'] = n_cand_local
                            if bId == 0:
                                n_cand[0].append(
                                    {'i': d_id, 't': t_id, 'type': 'ctx',
                                     'n': n_cand_local})
                        bId += 1

        for all_cand in n_cand[0]:  # for now only first entry
            # print(neighborhood, len(nb_summary), all_cand)
            for n_cand_x in all_cand['n']:
                cand_id = n_cand_x[0]
                if cand_id in nb_summary:
                    nb_summary[cand_id]['occ'].append(
                        [n_cand_x[0], n_cand_x[1], all_cand['t'],
                         all_cand['i']])
                else:
                    nb_summary[cand_id] = {
                        'id': cand_id,
                        'v': index.get_vector(cand_id),
                        'occ': [[n_cand_x[0], n_cand_x[1], all_cand['t'],
                                 all_cand['i']]],
                        'pivot': -1
                    }

        nb_summary_list = list(nb_summary.values())

        for t_id, t_states in enumerate(states):
            for s_id, state in enumerate(t_states):
                nb_summary_list.append({
                    'id': -1000 * (t_id + 1) + s_id,
                    'v': state,
                    'occ': [(-1, 0.0, t_id, s_id)],
                    'pivot': s_id
                })

        #
        positions = pca.fit_transform([x['v'] for x in nb_summary_list])
        #
        for i in range(len(positions)):
            nb_summary_list[i]['pos'] = positions[i].tolist()
            del nb_summary_list[i]['v']

        res[neighborhood] = nb_summary_list

    return res


def translate(project, in_sentences):
    model = project.model

    translations = model.translate(in_text=in_sentences)

    return translations


# ------ API routing as defined in swagger.yaml (connexion)
def get_translation(**request):
    current_project = list(projects.values())[0]

    in_sentence = request['in']
    neighbors = request.get('neighbors', [])

    translations = translate(current_project, [in_sentence])
    # print(translations)
    all_n = all_neighbors(current_project, translations, neighbors)
    #
    # print(neighbors,
    #       all_n)
    res = translations[0]
    res['allNeighbors'] = all_n

    return res


def get_translation_compare(**request):
    current_project = list(projects.values())[0]

    in_sentence = request['in']
    compare_sentence = request['compare']
    neighbors = request.get('neighbors', [])

    translations = translate(current_project, [in_sentence, compare_sentence])
    all_n = all_neighbors(current_project, translations, neighbors)

    return {'in': translations[0], 'compare': translations[1],
            'neighbors': all_n}


def extract_sentence(x):
    return ' '.join(
        map(lambda y: y['token'], x['decoder'][0]))


def extract_attn(x):
    return np.array(x['attn'][0])


def compare_translation(**request):
    pivot = request["in"]
    compare = request["compare"]
    neighbors = request.get('neighbors', [])

    current_project = list(projects.values())[0]
    model = current_project.model

    # trans_all = model.translate(in_text=[pivot]+compare)

    pivot_res = translate(current_project, [pivot])[0]
    pivot_attn = extract_attn(pivot_res)
    pivot_attn_l = pivot_attn.shape[0]

    # compare.append(pivot)
    compare_t = translate(current_project, compare)

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
        embeddings = current_project.embeddings[
            'encoder']  # TODO: change !!
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
        positions = P_METHODS[p_method].fit_transform(
            matrix[neighbour_ids, :])

    return {'word': names,
            # 'word_vector': matrix[neighbour_ids, :].tolist(),
            'score': neighbors[neighbour_ids].tolist(),
            'pos': positions.tolist()
            }


def get_neighbor_details(**request):
    current_project = list(projects.values())[0]

    indices = request['indices']
    index = current_project.get_index(
        request["vector_name"])  # type: VectorIndex

    return index.get_details(indices)


def get_close_vectors(**request):
    current_project = list(projects.values())[0]  # type: S2SProject
    # os.path.join(current_project.directory, request["vector_name"] + ".ann")
    index = current_project.get_index(
        request["vector_name"])  # type: VectorIndex
    closest = index.get_closest_x(request["indices"],
                                  include_distances=True)
    # print(request["vector_name"], request['index'])

    return closest


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
