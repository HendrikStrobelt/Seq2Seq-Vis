class LRU:

    def __init__(self, k=5):
        self.k = k
        self.cache = []

    def get(self, key):
        i = 0
        l = len(self.cache)
        hit = None
        while i < l and not hit:
            if self.cache[i]['key'] == key:
                hit = self.cache[i]
            i += 1

        if hit:
            self.cache.remove(hit)
            self.cache.insert(0, hit)
            return hit['object']
        else:
            return None

    def add(self, key, obj):
        self.cache.insert(0, {'key': key, 'object': obj})
        if len(self.cache) > self.k:
            self.cache.pop()
