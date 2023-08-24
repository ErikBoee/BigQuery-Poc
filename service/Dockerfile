FROM node:16

COPY . .
RUN npm ci

RUN npm run build
CMD [ "node", "dist/index.js" ]
