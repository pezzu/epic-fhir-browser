FROM node:12.20-alpine AS builder

USER node
WORKDIR /home/node/app

COPY --chown=node:node . ./
RUN npm ci && npm run build


FROM node:12.20-alpine AS app

USER node
WORKDIR /home/node/app
EXPOSE 8080

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --production && npm cache clean --force

COPY --chown=node:node --from=builder /home/node/app/build ./build
COPY --chown=node:node src/server ./src/server

CMD ["node", "src/server/server.js"]
