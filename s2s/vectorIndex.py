from annoy import AnnoyIndex


class VectorIndex:

    def __init__(self, file_name, dim_vector=500):
        self.u = AnnoyIndex(dim_vector)
        self.u.load(file_name)

    def get_closest(self, ix, k=10, ignore_same_tgt=False,
                    include_distances=False, use_vectors=False):
        if ignore_same_tgt:
            interval_min = ix // 55 * 55
            if use_vectors:
                candidates = self.u.get_nns_by_vector(ix, k + 55,
                                                      search_k=100000,
                                                      include_distances=include_distances)
            else:
                candidates = self.u.get_nns_by_item(ix, k + 55, search_k=100000,
                                                    include_distances=include_distances)
            if include_distances:
                return [k for k in zip(*candidates)
                        if not interval_min <= k[0] <= interval_min + 55][:k]
            else:
                return [k for k in candidates
                        if not interval_min <= k <= interval_min + 55][:k]
        else:
            if use_vectors:
                return list(
                    zip(*self.u.get_nns_by_vector(ix, k, search_k=100000,
                                                  include_distances=include_distances)))

            else:
                return list(zip(*self.u.get_nns_by_item(ix, k, search_k=100000,
                                                        include_distances=include_distances)))

    def get_closest_x(self, ixs, k=10, ignore_same_tgt=False,
                      include_distances=False, use_vectors=False):
        res = []
        for ix in ixs:
            res.append(
                self.get_closest(ix, k, ignore_same_tgt, include_distances,
                                 use_vectors))
        return res


def search_to_sentence_index(index):
    return index // 55, index % 55


def sentence_to_search_index(sentence, pos_in_sent):
    return sentence * 55 + pos_in_sent
