FROM node:12.20-alpine AS builder

USER node
WORKDIR /home/node/app

COPY --chown=node:node . ./
RUN npm ci --production && npm cache clean --force && npm run build


FROM node:12.20-alpine

USER node
WORKDIR /home/node/app
EXPOSE 8080

COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/app/build ./build
COPY --chown=node:node src/server ./src/server

CMD ["node", "src/server/server.js"]
