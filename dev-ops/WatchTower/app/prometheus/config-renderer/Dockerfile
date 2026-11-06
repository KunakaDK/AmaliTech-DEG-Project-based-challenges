FROM node:20-alpine
WORKDIR /app
COPY render-config.js .
RUN mkdir /output && chown node:node /output
USER node
ENTRYPOINT ["node", "/app/render-config.js"]
