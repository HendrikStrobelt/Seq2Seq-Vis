# FROM hendrikstrobelt/seq2seq-vis:base
FROM sgratzl/seq2seq-vis-base

# FROM continuumio/miniconda3:4.4.10

# RUN conda update --yes -n base conda &&\
#     conda clean --all --yes
#
# ADD ./environment.yml /tmp/
# RUN conda env create -f /tmp/environment.yml &&\
#    conda clean --all --yes &&\
#    rm -rf /boot/.cache/pip ~/.cache/pip
#
# WORKDIR /tmp
# ADD ./setup_onmt_custom.sh /tmp/
# RUN /bin/bash /tmp/setup_onmt_custom.sh &&\
#     rm -rf /tmp /boot/.cache/pip ~/.cache/pip
#
# ENTRYPOINT [ "/bin/bash", "-c" ]

WORKDIR /ws
EXPOSE 8080
VOLUME /data
CMD [ "source activate s2sv && python3 server.py --dir /data  --cache /data/cache" ]

ADD . /ws/

# build client and clean up afterwards
RUN /bin/bash /ws/setup_client.sh &&\
    conda uninstall --name s2sv --yes nodejs &&\
    conda clean --all --yes &&\
    rm -rf client ~/.npm /boot/.cache/pip ~/.cache/pip
