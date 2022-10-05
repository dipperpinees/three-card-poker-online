const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
require('dotenv').config();
const upload = require('./lib/multer');
const Game = require('./lib/game');
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

server.listen(process.env.PORT || 8021);
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const game = new Game(io);

app.post('/avatar', upload.single('avatar'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({error: 'Fail upload a file'})
    }
    res.json({avatar: file.filename})
});

io.on('connection', (socket) => {
    socket.emit('update', game.listPlayer);
    socket.emit('contribute', game.contribute);

    socket.on('join', ({ name, pos, cash, avatar }) => {
        game.playerJoin(socket, name, pos, cash, avatar);
    });

    socket.on('reset', () => {
        game.reset();
    });

    socket.on('askmaster', () => {
        game.pleaseMaster(socket);
    });

    socket.on('changemaster', (args) => {
        game.changeMaster(socket, args);
    });

    socket.on('start', () => {
        game.start();
    });

    socket.on('maxcash', (args) => {
        game.newMaxCash(socket, args);
    });

    socket.on('sendcash', (args) => {
        game.sendCash(socket, args);
    });

    socket.on('putother', ({ putId, putCash }) => {
        game.putOther(socket, putId, putCash);
    });

    socket.on('opencard', () => {
        game.openCard(socket);
    });

    socket.on('disconnect', () => {
        game.disconnect(socket);
    });

    socket.on('changepos', (args) => {
        game.changePos(socket, args);
    });

    socket.on('sendother', ({ recipientId, recipientCash }) => {
        game.sendOther(socket, recipientId, recipientCash);
    });

    socket.on('changepos', ({ pos }) => {
        game.changePos(socket, pos);
    });

    socket.on('contribute', () => {
        game.contributeCash(socket);
    });
});
