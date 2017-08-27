import argparse
import json
import onmt
import torch
import torchtext
import os

from model_api.abstract_model_api import AbstractModelAPI
from collections import Counter
from onmt.IO import extractFeatures

PAD_WORD = '<blank>'
UNK = 0
BOS_WORD = '<s>'
EOS_WORD = '</s>'


def add_model_arguments(parser):
    """
    These options are passed to the construction of the model.
    Be careful with these as they will be used during translation.
    """
    # Model options
    parser.add_argument('-model_type', default='text',
                        help="Type of encoder to use. Options are [text|img].")
    # Embedding Options
    parser.add_argument('-word_vec_size', type=int, default=-1,
                        help='Word embedding for both.')
    parser.add_argument('-src_word_vec_size', type=int, default=500,
                        help='Src word embedding sizes')
    parser.add_argument('-tgt_word_vec_size', type=int, default=500,
                        help='Tgt word embedding sizes')

    parser.add_argument('-feat_vec_size', type=int, default=20,
                        help="""When using -feat_merge mlp, feature embedding
                        sizes will be set to this.""")
    parser.add_argument('-feat_merge', type=str, default='concat',
                        choices=['concat', 'sum', 'mlp'],
                        help='Merge action for the features embeddings')
    parser.add_argument('-feat_vec_exponent', type=float, default=0.7,
                        help="""When using -feat_merge concat, feature embedding
                        sizes will be set to N^feat_vec_exponent where N is the
                        number of values the feature takes.""")
    parser.add_argument('-position_encoding', action='store_true',
                        help='Use a sin to mark relative words positions.')
    parser.add_argument('-share_decoder_embeddings', action='store_true',
                        help='Share the word and out embeddings for decoder.')

    # RNN Options
    parser.add_argument('-encoder_type', type=str, default='rnn',
                        choices=['rnn', 'brnn', 'mean', 'transformer'],
                        help="""Type of encoder layer to use.""")
    parser.add_argument('-decoder_type', type=str, default='rnn',
                        choices=['rnn', 'transformer'],
                        help='Type of decoder layer to use.')

    parser.add_argument('-layers', type=int, default=-1,
                        help='Number of layers in enc/dec.')
    parser.add_argument('-enc_layers', type=int, default=2,
                        help='Number of layers in the encoder')
    parser.add_argument('-dec_layers', type=int, default=2,
                        help='Number of layers in the decoder')

    parser.add_argument('-rnn_size', type=int, default=500,
                        help='Size of LSTM hidden states')
    parser.add_argument('-input_feed', type=int, default=1,
                        help="""Feed the context vector at each time step as
                        additional input (via concatenation with the word
                        embeddings) to the decoder.""")
    parser.add_argument('-rnn_type', type=str, default='LSTM',
                        choices=['LSTM', 'GRU'],
                        help="""The gate type to use in the RNNs""")
    # parser.add_argument('-residual',   action="store_true",
    #                     help="Add residual connections between RNN layers.")

    parser.add_argument('-brnn',   action="store_true",
                        help="Deprecated, use `encoder_type`.")
    parser.add_argument('-brnn_merge', default='concat',
                        choices=['concat', 'sum'],
                        help="Merge action for the bidir hidden states")

    parser.add_argument('-context_gate', type=str, default=None,
                        choices=['source', 'target', 'both'],
                        help="""Type of context gate to use.
                        Do not select for no context gate.""")

    # Attention options
    parser.add_argument('-global_attention', type=str, default='general',
                        choices=['dot', 'general', 'mlp'],
                        help="""The attention type to use:
                        dotprot or general (Luong) or MLP (Bahdanau)""")

    # Genenerator and loss options.
    parser.add_argument('-copy_attn', action="store_true",
                        help='Train copy attention layer.')
    parser.add_argument('-copy_attn_force', action="store_true",
                        help='When available, train to copy.')
    parser.add_argument('-coverage_attn', action="store_true",
                        help='Train a coverage attention layer.')
    parser.add_argument('-lambda_coverage', type=float, default=1,
                        help='Lambda value for coverage.')


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
        src = srcline.split()
        d = {"src": src, "indices": 0}

        examples = [d]
        # src_words = [src]

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

        super(ONMTStringData, self).__init__(examples, fields, None)


class ONMTmodelAPI(AbstractModelAPI):
    def __init__(self, model_loc, gpu=-1, beam_size=5):
        # Simulate all commandline args
        parser = argparse.ArgumentParser(description='translate.py')
        add_translate_arguments(parser)
        self.opt = parser.parse_known_args()[0]
        self.opt.model = model_loc
        self.opt.beam_size = beam_size
        self.opt.batch_size = 1

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
            predBatch, predScore, goldScore, attn, src, context, decStates\
                = self.translator.translate(batch, data, states=True)
            res = {}
            # Fill encoder Result
            encoderRes = []
            for ix, t in enumerate(in_text.split()):
                encoderRes.append({'token': t,
                                   'state': context[ix].tolist(),
                                   'embed': []})
            res['encoder'] = encoderRes

            os.write(1, bytes('\n PRED %d: %s\n' %
                              (1, " ".join(predBatch[0][0])), 'UTF-8'))

            # Fill decoder Result
            decoderRes = []
            attnRes = []
            for ix, p in enumerate(predBatch[0]):
                if p: 
                    topIx = []
                    topIxAttn = []
                    for t, a, s in zip(p, attn[0][ix], decStates[ix]):
                        currentDec = {}
                        currentDec['token'] = t
                        currentDec['state'] = s.tolist()
                        currentDec['embed'] = []
                        topIx.append(currentDec)
                        topIxAttn.append(list(a))
                        # if t in ['.', '!', '?']:
                        #     break
                    decoderRes.append(topIx)
                    attnRes.append(topIxAttn)
            res['scores'] = predScore[0].numpy().tolist()
            res['decoder'] = decoderRes
            res['attn'] = attnRes
            res['context'] = context.tolist()
            return res


def main():
    model = ONMTmodelAPI("data/ende_acc_15.72_ppl_912.74_e9.pt")

    model.translate("This is a test")


if __name__ == "__main__":
    main()
