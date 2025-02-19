FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 7001

CMD [ "npm", "run", "start" ]
