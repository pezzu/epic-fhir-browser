FROM node:12.20-alpine AS builder

WORKDIR /home/node
COPY --chown=node:node . ./

USER node
RUN npm ci && npm run build


FROM node:12.20-alpine AS app

WORKDIR /home/node
EXPOSE 8080

COPY --chown=node:node --from=builder /home/node/build ./build
COPY --chown=node:node src/server ./src/server
COPY --chown=node:node package.json package-lock.json ./

USER node
RUN npm ci --production && npm cache clean --force

CMD ["node", "src/server/server.js"]