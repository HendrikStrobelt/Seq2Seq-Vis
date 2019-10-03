#!/usr/bin/env bash

# just to be sure :)
source activate s2sv

# clone modified opennmt repo which exposes internals to Seq2Seq-Vis
git clone https://github.com/sebastianGehrmann/OpenNMT-py.git
cd OpenNMT-py/
git checkout states_in_translation
python setup.py install
pip install torchtext==0.2.3
cd ..
