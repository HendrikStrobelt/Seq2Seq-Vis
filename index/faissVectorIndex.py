import numpy as np
import sys

sys.path.append('faiss')
import faiss


class FaissVectorIndex:

    def __init__(self, file_name, dim_vector=500):
        self.u = faiss.read_index(file_name)  # type: faiss.Index

    def get_closest(self, ix, k=10, ignore_same_tgt=False,
                    include_distances=False, use_vectors=False):
        """
        :param ix: vector or index ID
        :param k: number of nearest neighbors
        :param ignore_same_tgt:
        :param include_distances:
        :param use_vectors:
        :return: list [(id, distance),...]
        """

        ix_conv = np.array([ix], dtype='float32')

        if use_vectors:
            candidates = self.u.search(ix_conv, k)
            print(candidates)
        else:
            print('not possible')
            candidates = []

        if ignore_same_tgt:
            print('not possible')
            return []
            # interval_min = ix // 55 * 55
            #
            # if include_distances:
            #     return [k for k in zip(candidates[1][0], candidates[0][0])
            #             if not interval_min <= k[0] <= interval_min + 55][:k]
            # else:
            #     return [k for k in candidates[1][0]
            #             if not interval_min <= k <= interval_min + 55][:k]
        else:
            if include_distances:
                return zip(candidates[1][0].tolist(), candidates[0][0].tolist())
            else:
                return candidates[1][0].tolist()

    def get_closest_x(self, ixs, k=10, ignore_same_tgt=False,
                      include_distances=False, use_vectors=False):
        res = []

        ix_conv = np.array(ixs, dtype='float32')

        dists, inds = self.u.search(ix_conv, k)

        for i in range(dists.shape[0]):
            res.append(zip(inds[i].tolist(), dists[i].tolist()))

        # for ix in ixs:
        #     res.append(
        #         self.get_closest(ix, k, ignore_same_tgt, include_distances,
        #                          use_vectors))
        return res

    def get_details(self, ixs):
        res = []
        for ix in ixs:
            res.append({'index': ix,
                        'v': self.u.get_item_vector(ix),
                        'pos': self.search_to_sentence_index(ix)})

        return res

    def get_vectors(self, ixs):
        return map(lambda x: self.u.reconstruct(x), ixs)

    def get_vector(self, ix):
        ix_c = int(ix)
        return self.u.reconstruct(ix_c)

    def search_to_sentence_index(self, index):
        return index // 50, index % 50

    def sentence_to_search_index(self, sentence, pos_in_sent):
        return sentence * 50 + pos_in_sent
