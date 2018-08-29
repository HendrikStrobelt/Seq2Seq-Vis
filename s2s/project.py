import os

import h5py
import numpy as np
from sklearn.externals import joblib

from index.faissVectorIndex import FaissVectorIndex
from model_api.opennmt_model import ONMTmodelAPI
from index.annoyVectorIndex import AnnoyVectorIndex

__author__ = 'Hendrik Strobelt, Sebastian Gehrmann'
import yaml


class S2SProject:
    def __init__(self, config_file, directory):
        with open(config_file, 'rb') as cff:
            self.config = yaml.load(cff)
        self.model = ONMTmodelAPI(os.path.join(directory, self.config['model']))
        self.embeddings = h5py.File(
            os.path.join(directory, self.config['embeddings']), mode='r')
        self.train_data = h5py.File(
            os.path.join(directory, self.config['train']), mode='r')
        self.dicts = {'i2t': {'src': {}, 'tgt': {}},
                      't2i': {'src': {}, 'tgt': {}}}

        self.cached_norms = {'src': None, 'tgt': None}
        self.directory = os.path.abspath(directory)

        self.indexType = self.config.get('indexType', 'annoy')
        self.has_neighbors = ('indices' in self.config)

        self.indices = None
        self.currentIndexName = None
        self.currentIndex = None

        self.project_model = None
        if 'project_model' in self.config:
            self.project_model = joblib.load(
                os.path.join(directory, self.config['project_model']))

        for h in ['src', 'tgt']:
            with open(os.path.join(directory, self.config['dicts'][h])) as f:
                raw = f.readline()
                while len(raw) > 0:
                    line = raw.strip()
                    if len(line) > 0:
                        iid, token = line.split()
                        iid = int(iid)
                        self.dicts['i2t'][h][iid] = token
                        self.dicts['i2t'][h][0] = '<unk>'  # todo: hack
                        self.dicts['t2i'][h][token] = iid
                    raw = f.readline()

    def info(self):
        return {
            'model': self.config['model'],
            'has_neighbors': self.has_neighbors
        }

    def cached_norm(self, loc, matrix):
        if self.cached_norms[loc] is None:
            self.cached_norms[loc] = np.linalg.norm(matrix, axis=1)

        return self.cached_norms[loc]

    # def convert_result_to_correct_index(self, oldix):
    #     return oldix // 55, oldix % 55

    def ix2text(self, array, vocab, highlight=-1):
        tokens = []
        for ix, t in enumerate(array):
            if ix == highlight:
                tokens.append("--|" + vocab[t] + "|--")
            elif t != 1:
                tokens.append(vocab[t])
        return " ".join(tokens)

    def get_train_for_index(self, ixs, data_src='tgt'):

        # Compute length of a sentence when ignoring padding
        def compute_sent_length(array):
            return np.sum([1 for t in array if t != 1])

        def ix2words(indices, word_dict):
            return [word_dict.get(x, '???') for x in indices if x != 1]

        res = []
        for ix in ixs:
            sentIx, tokIx = self.get_index('encoder').search_to_sentence_index(
                ix)
            # Get raw list of tokens
            src_in = self.train_data['src'][sentIx]
            tgt_in = self.train_data['tgt'][sentIx]
            # Convert to text
            if data_src == 'tgt':
                src = self.ix2text(src_in, self.dicts['i2t']['src'])
                tgt = self.ix2text(tgt_in, self.dicts['i2t']['tgt'], tokIx)
            else:
                src = self.ix2text(src_in, self.dicts['i2t']['src'], tokIx)
                tgt = self.ix2text(tgt_in, self.dicts['i2t']['tgt'])

            # attn = self.train_data['attn'][sentIx]
            # src_len = compute_sent_length(src_in)
            # tgt_len = compute_sent_length(tgt_in)
            # attn = attn[:tgt_len, :src_len]

            res.append({'src': src, 'tgt': tgt,
                        'src_words': ix2words(src_in, self.dicts['i2t']['src']),
                        'tgt_words': ix2words(tgt_in, self.dicts['i2t']['tgt']),
                        # 'attn': attn.tolist(),
                        'sentId': sentIx, 'tokenId': tokIx})
        # print(src)
        # print(tgt)
        return res

    def _load_index(self, name):
        path = None
        if 'indices' in self.config:
            if name in self.config['indices']:
                path = os.path.join(self.directory,
                                    self.config['indices'][name])
        if not path:
            extension = ".ann"
            if self.indexType == 'faiss':
                extension = ".faiss"
            path = os.path.join(self.directory, name + extension)

        if os.path.exists(path):
            if self.indexType == 'faiss':
                return FaissVectorIndex(path)
            else:
                return AnnoyVectorIndex(path)

    def preload_indices(self, names=[]):
        self.indices = {}
        for name in names:
            self.indices[name] = self._load_index(name)

    def get_index(self, name):

        if self.indices is not None:  # if pre-loaded
            if name not in self.indices:
                print('loading ', name)
                self.indices[name] = self._load_index(name)
            return self.indices[name]

        else:  # if NOT pre-loaded
            if name != self.currentIndexName:
                print('loading ', name)
                self.currentIndexName = name
                self.currentIndex = self._load_index(name)
            return self.currentIndex

        # if name not in self.indices:
        #
        #     path = None
        #     if 'indices' in self.config:
        #         if name in self.config['indices']:
        #             path = os.path.join(self.directory,
        #                                 self.config['indices'][name])
        #     if not path:
        #         extension = ".ann"
        #         if self.indexType == 'faiss':
        #             extension = ".faiss"
        #         path = os.path.join(self.directory, name + extension)
        #
        #     print('index:', str(path))
        #
        #     if os.path.exists(path):
        #         if self.indexType == 'faiss':
        #             self.indices[name] = FaissVectorIndex(path)
        #         else:
        #             self.indices[name] = AnnoyVectorIndex(path)
        #
        # return self.indices[name]
