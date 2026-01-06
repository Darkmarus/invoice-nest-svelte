FROM invoice-nest-deps AS build

WORKDIR /app

ENV CI=true

COPY package*.json .
COPY tsconfig*.json .
COPY nest-cli.json .
COPY src src
COPY libs libs

RUN npm run build && \
    npm prune --prod


FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV USER=node

COPY --from=build /app/package*.json .
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist

USER $USER
EXPOSE 3000
CMD ["node", "dist/main.js"]
