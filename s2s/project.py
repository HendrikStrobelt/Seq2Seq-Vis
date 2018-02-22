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

    def get_index(self, name):
        if name not in self.indices:
            path = os.path.join(self.directory, name + ".ann")
            if os.path.exists(path):
                self.indices[name] = VectorIndex(path)

        return self.indices[name]
