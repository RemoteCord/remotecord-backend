FROM node:22-alpine3.20 AS base

ENV DIR /app
WORKDIR $DIR
ARG NPM_TOKEN
ENV NODE_OPTIONS=--max-old-space-size=4096

FROM base AS dev

ENV NODE_ENV=development
ENV CI=true

# Install dumb-init along with other dependencies
RUN apk add --no-cache python3 make g++ krb5-dev dumb-init

RUN npm install -g pnpm@9.14.2

# Copy all project files for build
COPY . .

# Install dependencies 
RUN pnpm install --frozen-lockfile

# Build the application and make sure it produces output
RUN pnpm build && ls -la dist/

USER node
EXPOSE $PORT

# Use the full path to dumb-init
CMD ["/usr/bin/dumb-init", "node", "dist/main.js"]