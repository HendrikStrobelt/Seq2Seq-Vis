#!/usr/bin/env bash

# Install all essential packages
conda env create -f environment.yml
source activate s2sv


# Build client
conda install --name s2sv --yes -c conda-forge nodejs
cd client
npm install
npm run build
cd ..



