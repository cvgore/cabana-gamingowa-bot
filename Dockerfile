FROM node:16-bullseye-slim as make-app

ARG GIT_HASH
ENV COMMIT_HASH ${GIT_HASH}

ENV TINI_VERSION v0.19.0
RUN apt-get update \
    && apt-get install gpg python3 build-essential -y \
    && apt-get clean
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-arm64 /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-arm64.asc /tini.asc
RUN gpg --batch --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 \
 && gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini

ENV NODE_ENV production

WORKDIR /app
USER node

COPY --chown=node:node . /app

RUN npm ci --only=production

###

FROM node:16-bullseye-slim

ARG GIT_HASH
ENV COMMIT_HASH ${GIT_HASH}

ENV NODE_ENV production

WORKDIR /app
USER node

COPY --chown=node:node . /app
COPY --from=make-app /app/node_modules /app/node_modules
COPY --from=make-app /tini /tini

HEALTHCHECK CMD curl http://localhost:14587 || exit 1

ENTRYPOINT ["/tini", "--"]

CMD ["npm", "start"]