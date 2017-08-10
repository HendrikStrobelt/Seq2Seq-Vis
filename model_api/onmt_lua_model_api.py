import json
import requests
import logging

from model_api.abstract_model_api import AbstractModelAPI

__author__ = 'Hendrik Strobelt, Sebastian Gehrmann'


class ONMTLuaModelAPI(AbstractModelAPI):
    def __init__(self, url: str = "http://127.0.0.1:7784/translator/translate"):
        self.url = url

    def translate(self, in_text: str, partial_decode: str = None, k: int = 1, attn: dict = None):
        if k > 1:
            logging.warning('This version of the API only supports top 1 prediction. Sorry..')

        if partial_decode:
            logging.warning('This version of the API does not support partial decode.. ')

        response = requests.post(self.url, data=json.dumps([{"src": in_text}]))

        # response: [[{'src': 'Hello World', 'tgt': 'Hallo Welt', 'pred_score': -0.1768690943718, 'attn': [[0.62342292070389,
        # 0.37657704949379], [0.16017833352089, 0.83982169628143]], 'n_best': 1}]]

        r = response.json()[0][0]

        return {
            'encoder': list(map(lambda x: {'token': x}, r['src'].split())),
            'decoder': [list(map(lambda x: {'token': x}, r['tgt'].split()))],
            'attn': [list(r['attn'])]
        }

    def n_closest_tokens(self, token: str, n: int = 10):
        pass
