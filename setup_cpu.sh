#!/usr/bin/env bash

# Install all essential packages
conda create --yes --name s2sv python=3.6 h5py numpy scikit-learn flask
conda install --name s2sv --yes -c conda-forge connexion nodejs python-annoy
conda install --name s2sv --yes -c pytorch pytorch torchvision faiss-cpu
source activate s2sv


cd client
npm install
npm run wp
cd ..



