import os

import h5py
import numpy as np

from model_api.opennmt_model import ONMTmodelAPI
from s2s.vectorIndex import VectorIndex

__author__ = 'Hendrik Strobelt, Sebastian Gehrmann'
import yaml


class S2SProject:
    def __init__(self, config_file, directory):
        with open(config_file, 'rb') as cff:
            self.config = yaml.load(cff)
        self.model = ONMTmodelAPI(os.path.join(directory, self.config['model']))
        self.embeddings = h5py.File(
            os.path.join(directory, self.config['embeddings']))
        self.train_data = h5py.File(
            os.path.join(directory, self.config['train']))
        self.dicts = {'i2t': {'src': {}, 'tgt': {}},
                      't2i': {'src': {}, 'tgt': {}}}

        self.cached_norms = {'src': None, 'tgt': None}
        self.directory = os.path.abspath(directory)

        self.indices = {}

        for h in ['src', 'tgt']:
            with open(os.path.join(directory, self.config['dicts'][h])) as f:
                raw = f.readline()
                while len(raw) > 0:
                    line = raw.strip()
                    if len(line) > 0:
                        iid, token = line.split()
                        iid = int(iid)
                        self.dicts['i2t'][h][iid] = token
                        self.dicts['t2i'][h][token] = iid
                    raw = f.readline()

    def cached_norm(self, loc, matrix):
        if self.cached_norms[loc] is None:
            self.cached_norms[loc] = np.linalg.norm(matrix, axis=1)

        return self.cached_norms[loc]

    def convert_result_to_correct_index(self, oldix):
        return oldix // 55, oldix % 55

    def ix2text(self, array, vocab, highlight=-1):
        tokens = []
        for ix, t in enumerate(array):
            if ix == highlight:
                tokens.append("___" + vocab[t] + "___")
            elif t != 1:
                tokens.append(vocab[t])
        return " ".join(tokens)

    def get_train_for_index(self, ix, data_src='tgt'):
        sentIx, tokIx = self.convert_result_to_correct_index(ix)
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
        # attn = f['attn']['attn'][sentIx]
        # src_len = compute_sent_length(src_in)
        # tgt_len = compute_sent_length(tgt_in)
        # attn = attn[:tgt_len,:src_len]
        # print(src)
        # print(tgt)
        return src, tgt

    def get_index(self, name):
        if name not in self.indices:
            path = os.path.join(self.directory, name + ".ann")
            if os.path.exists(path):
                self.indices[name] = VectorIndex(path)

        return self.indices[name]
