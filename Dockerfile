FROM node:22-alpine3.20 AS base

ENV DIR /app
WORKDIR $DIR
ARG NPM_TOKEN
ENV NODE_OPTIONS=--max-old-space-size=4096

FROM base AS dev

ENV NODE_ENV=development
ENV CI=true

# Add these lines before npm install
RUN apk add --no-cache python3 make g++ krb5-dev

RUN npm install -g pnpm@9.14.2

COPY package.json pnpm-lock.yaml ./

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    pnpm install --frozen-lockfile && \
    rm -f .npmrc

COPY tsconfig*.json .
COPY .swcrc .
COPY nest-cli.json .
COPY src src

USER node
EXPOSE $PORT
CMD ["dumb-init", "node", "dist/main.js"]