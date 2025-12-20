FROM node:24-alpine AS base

ENV DIR /app

WORKDIR $DIR


FROM base AS build

ENV CI=true

COPY package*.json .
COPY tsconfig*.json .
COPY nest-cli.json .
COPY src src
COPY libs libs

RUN npm install && \
    npm run build && \
    npm prune --prod


FROM base AS production

ENV NODE_ENV=production
ENV USER=node

COPY --from=build $DIR/package.json .
COPY --from=build $DIR/package*.json .
COPY --from=build $DIR/node_modules node_modules
COPY --from=build $DIR/dist dist

USER $USER
EXPOSE 3000
CMD ["node", "dist/main.js"]
