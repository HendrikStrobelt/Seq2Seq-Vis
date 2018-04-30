#!/usr/bin/env bash

# Build client
conda install --name s2sv --yes -c conda-forge nodejs
source activate s2sv
cd client
npm install
npm run build
cd ..
