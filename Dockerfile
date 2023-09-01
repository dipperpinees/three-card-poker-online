FROM node:18-alpine3.17

WORKDIR /usr/src/app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 7001

CMD [ "yarn", "start:prod" ]
