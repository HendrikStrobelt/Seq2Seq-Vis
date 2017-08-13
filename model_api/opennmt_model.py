import argparse
import json
import onmt
import torch
import torchtext

from model_api.abstract_model_api import AbstractModelAPI
from collections import Counter
from onmt.IO import extractFeatures


def add_model_arguments(parser):
    # Model options
    parser.add_argument('-layers', type=int, default=2,
                        help='Number of layers in the LSTM encoder/decoder')
    parser.add_argument('-rnn_size', type=int, default=500,
                        help='Size of LSTM hidden states')
    parser.add_argument('-word_vec_size', type=int, default=500,
                        help='Word embedding sizes')
    parser.add_argument('-feature_vec_size', type=int, default=100,
                        help='Feature vec sizes')

    parser.add_argument('-input_feed', type=int, default=1,
                        help="""Feed the context vector at each time step as
                        additional input (via concatenation with the word
                        embeddings) to the decoder.""")
    parser.add_argument('-rnn_type', type=str, default='LSTM',
                        choices=['LSTM', 'GRU'],
                        help="""The gate type to use in the RNNs""")
    parser.add_argument('-brnn', action='store_true',
                        help='Use a bidirectional encoder')
    parser.add_argument('-brnn_merge', default='concat',
                        help="""Merge action for the bidirectional hidden states:
                        [concat|sum]""")
    parser.add_argument('-copy_attn', action="store_true",
                        help='Train copy attention layer.')
    parser.add_argument('-copy_attn_force', action="store_true",
                        help="""Train copy attention layer to copy even
                        if word is in the src vocab.
                        .""")

    parser.add_argument('-coverage_attn', action="store_true",
                        help='Train a coverage attention layer.')
    parser.add_argument('-lambda_coverage', type=float, default=1,
                        help='Lambda value for coverage.')

    parser.add_argument('-encoder_layer', type=str, default='rnn',
                        help="""Type of encoder layer to use.
                        Options: [rnn|mean|transformer]""")
    parser.add_argument('-decoder_layer', type=str, default='rnn',
                        help='Type of decoder layer to use. [rnn|transformer]')
    parser.add_argument('-context_gate', type=str, default=None,
                        choices=['source', 'target', 'both'],
                        help="""Type of context gate to use [source|target|both].
                        Do not select for no context gate.""")
    parser.add_argument('-attention_type', type=str, default='dot',
                        choices=['dot', 'mlp'],
                        help="""The attention type to use:
                        dotprot (Luong) or MLP (Bahdanau)""")
    parser.add_argument('-encoder_type', default='text',
                        help="Type of encoder to use. Options are [text|img].")
    parser.add_argument('-dropout', type=float, default=0.3,
                        help='Dropout probability.')
    parser.add_argument('-position_encoding', action='store_true',
                        help='Use a sinusoids for words positions.')
    parser.add_argument('-share_decoder_embeddings', action='store_true',
                        help='Share the word and softmax embeddings..')
    parser.add_argument('-share_embeddings', action='store_true',
                        help='Share word embeddings between encoder/decoder')


def add_translate_arguments(parser):
    # Add Translation Arguments
    parser.add_argument('-src_img_dir', default="",
                        help='Source image directory')
    parser.add_argument('-tgt',
                        help='True target sequence (optional)')
    parser.add_argument('-output', default='pred.txt',
                        help="""Path to output the predictions (each line will
                        be the decoded sequence""")
    parser.add_argument('-beam_size',  type=int, default=5,
                        help='Beam size')
    parser.add_argument('-batch_size', type=int, default=30,
                        help='Batch size')
    parser.add_argument('-max_sent_length', type=int, default=100,
                        help='Maximum sentence length.')
    parser.add_argument('-replace_unk', action="store_true",
                        help="""Replace the generated UNK tokens with the source
                        token that had highest attention weight. If phrase_table
                        is provided, it will lookup the identified source token and
                        give the corresponding target token. If it is not provided
                        (or the identified source token does not exist in the
                        table) then it will copy the source token""")
    parser.add_argument('-verbose', action="store_true",
                        help='Print scores and predictions for each sentence')
    parser.add_argument('-attn_debug', action="store_true",
                        help='Print best attn for each word')

    parser.add_argument('-dump_beam', type=str, default="",
                        help='File to dump beam information to.')

    parser.add_argument('-n_best', type=int, default=1,
                        help="""If verbose is set, will output the n_best
                        decoded sentences""")

    parser.add_argument('-gpu', type=int, default=-1,
                        help="Device to run on")
    # options most relevant to summarization
    parser.add_argument('-dynamic_dict', action='store_true',
                        help="Create dynamic dictionaries")
    parser.add_argument('-share_vocab', action='store_true',
                        help="Share source and target vocabulary")


class ONMTStringData(torchtext.data.Dataset):
    def __init__(self, srcline, tgt, fields, opt):
        srctoks = srcline.split()
        src, src_feats, _ = extractFeatures(srctoks)
        d = {"src": src, "indices": 0}
        for j, v in enumerate(src_feats):
            d["src_feat_" + str(j)] = v

        examples = [d]
        # src_words = [src]

        # Create dynamic dictionaries
        if opt is None or opt.dynamic_dict:
            # a temp vocab of a single source example
            src_vocab = torchtext.vocab.Vocab(Counter(src))

            # mapping source tokens to indices in the dynamic dict
            src_map = torch.LongTensor(len(src)).fill_(0)
            for j, w in enumerate(src):
                src_map[j] = src_vocab.stoi[w]

            self.src_vocabs = [src_vocab]
            examples[0]["src_map"] = src_map

        # TODO: same for tgt
        if tgt is not None:
            pass

        keys = examples[0].keys()
        fields = [(k, fields[k]) for k in keys]

        examples = list([torchtext.data.Example.fromlist([ex[k] for k in keys],
                                                         fields)
                         for ex in examples])

        super(ONMTStringData, self).__init__(examples, fields)


class ONMTmodelAPI(AbstractModelAPI):
    def __init__(self, model_loc, gpu=-1, beam_size=5):
        # Simulate all commandline args
        parser = argparse.ArgumentParser(description='translate.py')
        add_translate_arguments(parser)
        self.opt = parser.parse_known_args()[0]
        self.opt.model = model_loc
        self.opt.beam_size = beam_size

        # Make GPU decoding possible
        self.opt.gpu = gpu
        self.opt.cuda = self.opt.gpu > -1
        if self.opt.cuda:
            torch.cuda.set_device(self.opt.gpu)

        parser2 = argparse.ArgumentParser(description='train.py')
        add_model_arguments(parser2)
        self.opt2 = parser2.parse_known_args()[0]

        self.translator = onmt.Translator(self.opt, self.opt2.__dict__)

    def translate(self, in_text, partial_decode=None, k=5, attn=None):
        # set n_best in translator
        self.translator.opt.n_best = k
        # Increase Beam size if asked for large k
        if self.translator.opt.beam_size < k:
            self.translator.opt.beam_size = k

        # initialize Data Object
        data = ONMTStringData(in_text,
                              partial_decode,
                              self.translator.fields,
                              None)

        # initialize Iterator to access batch
        testData = onmt.IO.OrderedIterator(
            dataset=data,
            device=self.opt.gpu if self.opt.gpu else -1,
            batch_size=1,
            train=False,
            sort=False,
            shuffle=False)

        # Only has one batch, but indexing does not work
        for batch in testData:
            predBatch, predScore, goldScore, attn, src\
                = self.translator.translate(batch, data)
            res = {}
            # Fill encoder Result
            encoderRes = []
            for t in in_text.split():
                encoderRes.append({'token': t,
                                   'state': [],
                                   'embed': []})
            res['encoder'] = encoderRes

            # Fill decoder Result
            decoderRes = []
            attnRes = []
            for ix, p in enumerate(predBatch[0]):
                topIx = []
                topIxAttn = []
                for t, a in zip(p, attn[0][ix]):
                    currentDec = {}
                    currentDec['token'] = t
                    currentDec['state'] = []
                    currentDec['embed'] = []
                    topIx.append(currentDec)
                    topIxAttn.append(list(a))
                    if t in ['.', '!', '?']:
                        break
                decoderRes.append(topIx)
                attnRes.append(topIxAttn)

            res['decoder'] = decoderRes
            res['attn'] = attnRes

            return res


def main():
    model = ONMTmodelAPI("data/test_acc_74.91_ppl_3.66_e13.pt")

    model.translate("This is a test")


if __name__ == "__main__":
    main()