FROM node:18-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run install:client
RUN npm run build:client
RUN npm run build

CMD [ "npm", "run", "serve" ]