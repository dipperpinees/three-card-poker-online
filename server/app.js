const express = require("express");
const app = express();
const server = require("http").Server(app);
require('dotenv').config();

const Game = require("./lib/game");
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    }
});

server.listen(process.env.PORT || 8021);
app.use(express.json());

const game = new Game(io);