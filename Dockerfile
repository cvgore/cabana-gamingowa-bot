FROM node:16-bullseye-slim

ARG GIT_HASH
ENV COMMIT_HASH ${GIT_HASH}

ENV TINI_VERSION v0.19.0
RUN apt-get update \
    && apt-get install gpg python -y \
    && apt-get clean
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc /tini.asc
RUN gpg --batch --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 \
 && gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

ENV NODE_ENV production

WORKDIR /app
USER node

COPY --chown=node:node . /app

RUN npm ci --only=production

CMD ["npm", "start"]