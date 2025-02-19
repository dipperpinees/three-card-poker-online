import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as socketio from 'socket.io';
import http from 'http';
import Game from './lib/game';
import handleWS from './websocket/handle-ws';
import router from './routers';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    maxHttpBufferSize: 4e6,
    ...(process.env.NODE_ENV === 'development' && {
        cors: {
            origin: '*',
        },
    }),
});
const PORT = process.env.PORT || 7001;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(router);
process.env.NODE_ENV === 'production' && app.use(express.static(path.resolve("../web/build")));

const game = new Game(io);
io.on('connection', handleWS(game));
