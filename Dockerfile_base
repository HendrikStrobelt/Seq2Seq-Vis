FROM continuumio/miniconda3:4.4.10

RUN conda update --yes -n base conda &&\
    conda clean --all --yes

ADD ./environment.yml /tmp/
RUN conda env create -f /tmp/environment.yml &&\
    conda clean --all --yes &&\
    rm -rf /boot/.cache/pip ~/.cache/pip

# RUN conda create --yes --name s2sv python=3.6 h5py numpy scikit-learn flask
# RUN conda install --name s2sv --yes -c conda-forge connexion python-annoy
# RUN conda install --name s2sv --yes -c pytorch pytorch==0.3.1 faiss-cpu

WORKDIR /tmp
ADD ./setup_onmt_custom.sh /tmp/
RUN /bin/bash /tmp/setup_onmt_custom.sh &&\
    rm -rf /tmp /boot/.cache/pip ~/.cache/pip

ENTRYPOINT [ "/bin/bash", "-c" ]
