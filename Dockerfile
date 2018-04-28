FROM continuumio/miniconda3:4.4.10

RUN conda create --yes --name s2sv python=3.6 h5py numpy scikit-learn flask
RUN conda install --name s2sv --yes -c conda-forge connexion nodejs python-annoy
RUN conda install --name s2sv --yes -c pytorch pytorch torchvision faiss-cpu

EXPOSE 8080
VOLUME /data
WORKDIR /ws
# TODO copy stuff
CMD 'source activate s2sv && python3 server.py --dir /data'