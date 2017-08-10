class AbstractModelAPI:
    def translate(self, in_text: str, partial_decode: str = None, k: int = 10, attn: dict = None):
        """
        translates `in_text` using the associated model and returns
        meta information about the encoder side , the top `k` best
        translations (incl. decoder states and meta-data), and the
        attention values used for translation (k x dec_length x encoder_length).

        Returns an dict:
        {encoder: [{<1>},...], decoder: [[{<2>},..]], attn: [[{<1>},...]]};

        encoder, decoder, attn -- the inner [{},..] lists tokens in their order;
        decoder, attn -- the outer [[..]] lists the sorted top k predictions;

        <1>: {token:str, state:[], embed:[]} -- for each token encoder/decoder ;
        <2>: {attn:[]};



        :param attn: use alternative attention values
        :param k: k for top k translations
        :param partial_decode: a partial decoder string defines the left side of a decoding sequence
        :param in_text: the input text
        :return: see dictionary above



        """
        raise NotImplementedError(".. has to be implemented")

    def n_closest_tokens(self, token: str, n: int = 10):
        """
        returns the n closest tokens using cosine distance between embeddings

        :param token: the token
        :param n: how many closest token to return
        :return: list/array of tokens
        """

        raise NotImplementedError(".. has to be implemented")
