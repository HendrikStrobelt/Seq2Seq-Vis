class LRU:

    def __init__(self, k=5):
        self.k = k
        self.cache = []
        self.insert_to = 0

    def preload(self, key, obj, persist=True):
        self.add(key, obj)
        if persist:
            self.insert_to += 1

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
            self.cache.insert(self.insert_to, hit)
            return hit['object']
        else:
            return None

    def add(self, key, obj):
        self.cache.insert(self.insert_to, {'key': key, 'object': obj})
        if len(self.cache) > self.k:
            self.cache.pop()
