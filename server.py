#!/usr/bin/env python3

import argparse
import os
import time
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
import connexion
import logging

# import umap
from flask import send_from_directory, redirect
import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import MDS, TSNE

from copy import deepcopy

from s2s.lru import LRU
from s2s.project import S2SProject
from index.annoyVectorIndex import AnnoyVectorIndex

__author__ = 'Hendrik Strobelt, Sebastian Gehrmann'
CONFIG_FILE_NAME = 's2s.yaml'
projects = {}
cache_translate = LRU(5)
cache_compare = LRU(5)

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


def closest_vector_n(index, v, r=5):
    res = index.get_closest_x(v, k=100,
                              ignore_same_tgt=False,
                              include_distances=True,
                              use_vectors=True)

    if r > 1:
        res = [[(xx[0], round(xx[1])) for xx in yy] for yy in res]

    return res


def closest_vector(index, v, r=5):
    res = index.get_closest(v, k=12,
                            ignore_same_tgt=False,
                            include_distances=True,
                            use_vectors=True)

    # if r > 1:
    #     res = [(xx[0], round(xx[1])) for xx in res]

    return res


def project_states(vectors, p_method='pca', anchors=None):
    pca = P_METHODS[p_method]

    # todo: project down for TSNE
    # if p_method == 'tsne':
    #     vectors = PCA(n_components=50).fit_transform(vectors)
    #     anchors = None
    anchors = None

    # if p_method == 'umap':
    #     pca = umap.UMAP(n_neighbors=min(len(vectors), 10))
    #     anchors = None

    if anchors:
        pca.fit(anchors)
        return pca.transform(vectors)
    else:
        return pca.fit_transform(vectors)


# noinspection SpellCheckingInspection
def projection_hnlp(model, states, lengths):
    v = np.array(states)
    x_pos = model.predict(v)
    # expected progression
    y_pos_a = np.concatenate([(np.arange(1, l + 1, 1) / l) for l in lengths])
    # For removing the coefficients
    w = model.coef_
    w = np.expand_dims(w, 1)
    v_prime = v - np.dot(np.dot(v, w), w.T)
    y_pos_b = (TSNE(n_components=1, init='pca').fit_transform(v_prime)) \
        .flatten()
    y_pos_c = (PCA(n_components=1).fit_transform(v_prime)) \
        .flatten()

    return x_pos.tolist(), y_pos_a.tolist(), y_pos_b.tolist(), y_pos_c.tolist()


def create_proj_list(xs, ys, traces):
    res = []
    for ii in range(len(xs)):
        new_state = traces[ii].copy()
        new_state['pos'] = [xs[ii], ys[ii]]
        res.append(new_state)
    return res


def all_neighbors(project, translations, neighbors, p_method='tsne'):
    # pca = umap.UMAP()#TSNE(n_components=2)

    nr_nn_for_projection = 20

    res = {}
    for neighborhood in neighbors:
        n_cand = [[]]
        states = []
        nb_summary = {}
        start_t = time.time()

        for t_id, translation in translations.items():
            index = project.get_index(neighborhood)
            print('index-work starts..')

            if index:
                if neighborhood == 'encoder':
                    all_enc_states = list(
                        map(lambda x: x['state'], translation['encoder']))
                    states.append(all_enc_states)
                    closest_v = closest_vector_n(index, all_enc_states)
                    for e_id, enc in enumerate(translation['encoder']):
                        n_cand_local = closest_v[e_id]
                        enc['neighbors'] = n_cand_local
                        n_cand[0].append(
                            {'i': e_id, 't': t_id, 'type': 'enc',
                             'n': n_cand_local[:nr_nn_for_projection]})

                if neighborhood == 'decoder':
                    all_states = list(map(lambda x: x['state'],
                                          translation['decoder'][0]))

                    states.append(all_states)
                    closest_v = closest_vector_n(index, all_states)

                    bId = 0
                    # for beam in [translation['decoder'][0]]:
                    beam = translation['decoder'][0]
                    for d_id, dec in enumerate(beam):
                        n_cand_local = closest_v[d_id]
                        dec['neighbors'] = n_cand_local
                        if bId == 0:
                            n_cand[0].append(
                                {'i': d_id, 't': t_id, 'type': 'dec',
                                 'n': n_cand_local[:nr_nn_for_projection]})

                    bId += 1
                if neighborhood == 'context':
                    all_states = list(map(lambda x: x['context'],
                                          translation['decoder'][0]))
                    states.append(all_states)
                    closest_v = closest_vector_n(index, all_states)

                    bId = 0
                    # for beam in translation['decoder']:
                    beam = translation['decoder'][0]
                    for d_id, dec in enumerate(beam):
                        n_cand_local = closest_v[d_id]
                        dec['neighbor_context'] = n_cand_local
                        if bId == 0:
                            n_cand[0].append(
                                {'i': d_id, 't': t_id, 'type': 'ctx',
                                 'n': n_cand_local[:nr_nn_for_projection]})
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
                        'pivot': None
                    }

        nb_summary_list = list(nb_summary.values())

        sentence_states = []
        sentence_lengths = []
        sentence_traces = []
        # add the actual states as items to the space:
        for t_id, t_states in enumerate(states):
            sentence_lengths.append(len(t_states))
            for s_id, state in enumerate(t_states):
                sentence_traces.append({
                    'id': -10000 * (t_id + 1) + s_id,
                    'v': state,
                    'occ': [],
                    'pivot': {'trans_ID': t_id, 'word_ID': s_id}
                })
                # nb_summary_list.append({
                #     'id': -10000 * (t_id + 1) + s_id,
                #     'v': state,
                #     'occ': [],
                #     'pivot': {'trans_ID': t_id, 'word_ID': s_id}
                # })
                sentence_states.append(state)

        nb_summary_list = nb_summary_list + sentence_traces
        #
        print('index-time:', str(time.time() - start_t))
        start_t = time.time()
        positions = project_states([x['v'] for x in nb_summary_list],
                                   p_method, anchors=sentence_states)
        for i in range(len(positions)):
            nb_summary_list[i]['pos'] = positions[i].tolist()
            # nb_summary_list[i]['v']

        if project.project_model:
            x_pos, y_pos_a, y_pos_b, y_pos_c = projection_hnlp(
                project.project_model,
                sentence_states,
                sentence_lengths)

            res[neighborhood + '_a'] = create_proj_list(x_pos, y_pos_a,
                                                        sentence_traces)
            res[neighborhood + '_b'] = create_proj_list(x_pos, y_pos_b,
                                                        sentence_traces)
            res[neighborhood + '_c'] = create_proj_list(x_pos, y_pos_c,
                                                        sentence_traces)

        print('proj-time:', str(time.time() - start_t))
        #

        res[neighborhood] = nb_summary_list

    if 'encoder' in res and 'context' in res:
        enc_dec_states = list(map(lambda x: deepcopy(x),
                                  filter(lambda xx: xx['pivot'] is not None,
                                         res['encoder'])))
        all_decoder_list = list(map(lambda x: deepcopy(x),
                                    filter(lambda xx: xx['pivot'] is not None,
                                           res['context'])))

        for dec in all_decoder_list:
            dec['pivot']['trans_ID'] = 1
            enc_dec_states.append(dec)

        ed_pos = project_states([x['v'] for x in enc_dec_states], 'mds')
        for i in range(len(ed_pos)):
            enc_dec_states[i]['pos'] = ed_pos[i].tolist()

        res['enc_ctx'] = enc_dec_states

    for _, nb in res.items():
        for nbb in nb:
            del nbb['v']
            # nbb['v'] = list(map(lambda x: float(x), list(nbb['v'])))

    return res


def translate(project, in_sentences):
    model = project.model

    translations = model.translate(in_text=in_sentences)
    tgt_dict = project.dicts['i2t']['tgt']
    for _, trans in translations.items():
        for tk in trans['beam']:
            for lbeam in tk:
                lbeam['word'] = tgt_dict.get(lbeam['pred'], '??')

        trans['beam_trace_words'] = []

        for b_level in trans['beam_trace']:
            level_collect = []
            for b_trace in b_level:
                trace_collect = []
                for w_id in b_trace:
                    trace_collect.append(tgt_dict.get(w_id, '??'))
                level_collect.append(trace_collect)
            trans['beam_trace_words'].append(level_collect)

    return translations


# ------ API routing as defined in swagger.yaml (connexion)
def get_translation(**request):
    current_project = list(projects.values())[0]  # type: S2SProject

    in_sentence = request['in']
    neighbors = request.get('neighbors', [])

    res = cache_translate.get(in_sentence)
    if res:
        return res
    # for test_c in simple_cache:
    #     if test_c['in_sentence'] == in_sentence:
    #         hit = test_c
    # if hit:
    #     # move to front
    #     simple_cache.remove(hit)
    #     simple_cache.insert(0, hit)
    #     return hit['res']

    translations = translate(current_project, [in_sentence])

    print(translations[0]['beam'])
    all_n = all_neighbors(current_project, translations, neighbors)
    #
    # print(neighbors,
    #       all_n)
    res = translations[0]
    res['allNeighbors'] = all_n

    cache_translate.add(in_sentence, res)

    # simple_cache.insert(0, {'in_sentence': in_sentence, 'res': res})
    # if len(simple_cache) > 4:
    #     simple_cache.pop()

    return res


def get_translation_compare(**request):
    current_project = list(projects.values())[0]

    in_sentence = request['in']
    compare_sentence = request['compare']
    neighbors = request.get('neighbors', [])

    key = in_sentence + ' VS ' + compare_sentence

    res = cache_compare.get(key)
    if res:
        return res

    translations = translate(current_project, [in_sentence, compare_sentence])
    all_n = all_neighbors(current_project, translations, neighbors)

    res = {'in': translations[0], 'compare': translations[1],
           'neighbors': all_n}

    cache_compare.add(key, res)

    return res


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
    "pca": PCA(n_components=2, ),
    "mds": MDS(),
    "tsne": TSNE(init='pca'),
    # 'umap': umap.UMAP(metric='cosine'),
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
        request["vector_name"])  # type: AnnoyVectorIndex

    return index.get_details(indices)


def get_close_vectors(**request):
    current_project = list(projects.values())[0]  # type: S2SProject
    # os.path.join(current_project.directory, request["vector_name"] + ".ann")
    index = current_project.get_index(
        request["vector_name"])  # type: AnnoyVectorIndex
    closest = index.get_closest_x(request["indices"],
                                  include_distances=True)
    # print(request["vector_name"], request['index'])

    return closest


def train_data_for_index(**request):
    ids = request["indices"]
    loc = request["loc"]

    current_project = list(projects.values())[0]  # type: S2SProject
    res = current_project.get_train_for_index(ids, loc)

    return {'loc': loc, 'ids': ids, 'res': res}


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
