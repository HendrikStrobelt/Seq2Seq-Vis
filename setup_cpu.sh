#!/usr/bin/env bash

# Install all essential packages
#conda env create -f environment.yml

# Install all essential packages
conda create --yes --name s2sv python=3.6 h5py numpy scikit-learn flask
conda install --name s2sv --yes -c conda-forge connexion nodejs python-annoy
conda install --name s2sv --yes pytorch=0.3.1 -c soumith
conda install --name s2sv --yes -c pytorch faiss-cpu
source activate s2sv


# Build client
conda install --name s2sv --yes -c conda-forge nodejs
cd client
npm install
npm run build
cd ..



