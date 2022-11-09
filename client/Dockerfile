FROM node:16
WORKDIR /app

COPY package*.json ./

RUN npm config set legacy-peer-deps true
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]