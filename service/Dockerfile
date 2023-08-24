FROM node:16


# Bundle app source
WORKDIR /usr/src/app

COPY . .
RUN npm ci

RUN npm run build
CMD [ "node", "dist/index.js" ]