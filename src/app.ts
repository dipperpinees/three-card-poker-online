import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as socketio from 'socket.io';
import http from 'http';
import Game from './lib/game';
import handleWS from './websocket/handle-ws';
import router from './routers';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    maxHttpBufferSize: 4e6,
    ...(process.env.ENV === 'development' && {
        cors: {
            origin: '*',
        },
    }),
});

server.listen(process.env.PORT || 3001);
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
process.env.ENV === 'production' && app.use(express.static('public/client'));
app.use(express.urlencoded({ extended: true }));
app.use(router);

const game = new Game(io);
io.on('connection', handleWS(game));
