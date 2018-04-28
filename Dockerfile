FROM continuumio/miniconda3:4.4.10

RUN conda update --yes -n base conda

RUN conda create --yes --name s2sv python=3.6 h5py numpy scikit-learn flask
RUN conda install --name s2sv --yes -c conda-forge connexion python-annoy

RUN conda install --name s2sv --yes -c pytorch pytorch torchvision faiss-cpu

#ADD setup_cpu.sh /ws/
#RUN /ws/setup_cpu.sh

WORKDIR /tmp
ADD ./setup_onmt_custom.sh /tmp/
RUN /tmp/setup_onmt_custom.sh && rm -rf /tmp

#EXPOSE 8080
#VOLUME /data
#WORKDIR /ws

# TODO copy stuff
#CMD 'source activate s2sv && python3 server.py --dir /data'