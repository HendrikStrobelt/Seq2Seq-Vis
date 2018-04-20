import argparse
import faiss
import h5py
import numpy as np

from tqdm import tqdm
print("Loaded libraries...")

parser = argparse.ArgumentParser(
    description='''h5_to_faiss.py is used to go
                   from extracted states to
                   a faiss index
                   ''')
parser.add_argument(
    '-states',
    required=True,
    type=str,
    help="""Path of the states file""")
parser.add_argument(
    '-data',
    type=str,
    default="decoder_out",
    help="""Which set within the states to use""")

parser.add_argument(
    '-output', default="index.faiss",
    type=str,
    help="""Path of the output file""")
parser.add_argument(
    '-stepsize', type=int, default=100,
   help="""Add that many sequences at once
           (larger = more memory, but faster).""")

opt = parser.parse_args()

def main():
    f = h5py.File(opt.states, "r")
    data = f[opt.data]
    seqs, slens, hid = data.shape

    print("Processing {} Sequences".format(seqs))
    print("with {} tokens each".format(slens))
    print("and {} states".format(hid))

    # Initialize a new index
    index = faiss.IndexFlatIP(hid)
    # Fill it
    for ix in tqdm(range(0, seqs-opt.stepsize, opt.stepsize)):
        cdata = np.array(data[ix:ix+opt.stepsize]\
                  .reshape(-1, hid), dtype="float32")
        index.add(cdata)
    f.close()

    faiss.write_index(index, opt.output)

if __name__ == "__main__":
    main()