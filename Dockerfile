FROM sgratzl/seq2seq-vis-base

# RUN conda update --yes -n base conda

# TODO replace with
# ADD ./environment.yml /tmp/
# RUN conda env create -f /tmp/environment.yml && conda clean --all
# RUN conda create --yes --name s2sv python=3.6 h5py numpy scikit-learn flask
# RUN conda install --name s2sv --yes -c conda-forge connexion python-annoy
# RUN conda install --name s2sv --yes -c pytorch pytorch==0.3.1 faiss-cpu

# WORKDIR /tmp
# ADD ./setup_onmt_custom.sh /tmp/
# RUN /tmp/setup_onmt_custom.sh && rm -rf /tmp

WORKDIR /ws
EXPOSE 8080
VOLUME /data
CMD [ "source activate s2sv && python3 server.py --dir /data" ]

ADD . /ws/

# build client and clean up afterwards
RUN /bin/bash /ws/setup_client.sh &&\
    conda uninstall --name s2sv --yes nodejs &&\
    conda clean --all --yes &&\
    rm -rf client ~/.npm /boot/.cache/pip ~/.cache/pip
