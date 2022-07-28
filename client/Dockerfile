FROM node:16
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8021

CMD [ "npm", "start" ]