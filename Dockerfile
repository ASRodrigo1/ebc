FROM python:3.13.1-slim-bullseye AS base_stage

ARG USER_NAME=r

EXPOSE 8000

RUN useradd -ms /bin/bash --no-log-init ${USER_NAME}\
    && apt update\
    && apt install git netcat gcc graphviz libgraphviz-dev --assume-yes

ENV PATH="/home/${USER_NAME}/.local/bin:$PATH"

WORKDIR /app

COPY . .

#RUN python -m pip install --upgrade pip && python -m pip install .
RUN python -m pip install --upgrade pip && python -m pip install -e .

RUN chown -R ${USER_NAME}:${USER_NAME} /app

USER ${USER_NAME}

#CMD ["bash", "-c", "tail -f /dev/null"]
CMD ["/app/entrypoint.sh"]
