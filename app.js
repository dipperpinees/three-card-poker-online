const express = require("express");
const app = express();
const server = require("http").Server(app);
require('dotenv').config();

const Game = require("./game");
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    }
});

server.listen(process.env.PORT || 8021);
app.set('view engine', 'ejs');
app.use(express.json());


const game = new Game(io);

app.get("/admin", (req, res) => {
    if(!req.query.pass) {
        res.send("Need password");
        return;
    }

    if(req.query.pass !== process.env.PASS) {
        res.send("Wrong password");
        return;
    }

    res.render("admin", {listPlayer: game.listPlayer});
})

app.post("/resetall", (req, res) => {
    if(!req.query.pass || req.query.pass !== process.env.PASS) {
        res.json({ok: false});
        return;
    }
    game.listPlayer.forEach(player => {
        player.cash = 0;
    })
    game.update();
    res.json({ok: true});
})

app.post("/cash", (req, res) => {
    if(!req.query.pass || req.query.pass !== process.env.PASS) {
        res.json({ok: false});
        return;
    }
    game.listPlayer.forEach(player => {
        if(player.socketId === req.query.id) {
            player.cash = Number(req.query.cash) || 0;
        }
    })
    game.update();
    res.json({ok: true});
})

app.post("/kick", (req, res) => {
    if(!req.query.pass || !req.query.id || req.query.pass !== process.env.PASS) {
        res.json({ok: false});
        return;
    }
    game.disconnect({id: req.query.id});
    io.sockets.sockets.get(req.query.id).disconnect();
    res.json({ok: true});
})

app.post("/maxcash", (req, res) => {
    if(req.query.pass === process.env.PASS) {
        game.maxCash = Number(req.query.maxcash);
        io.sockets.emit('maxcash', Number(req.query.maxcash));
        res.send("success");
    } else {
        res.send("wrong password");
    }
})

io.on('connection', (socket) => {
    socket.emit('update', game.listPlayer);

    socket.on('join', ({name, pos, cash, avatar}) => {
        game.playerJoin(socket, name, pos, cash, avatar);
    })

    socket.on('reset', (args) => {
	    game.reset();
    })

    socket.on('askmaster', () => {
        game.pleaseMaster(socket);
    })

    socket.on('changemaster', (args) => {
        game.changeMaster(socket, args);
    })

    socket.on('start', (args) => {
        game.start()
    })

    socket.on('maxcash', (args) => {
        game.newMaxCash(socket, args)
    })

    socket.on('sendcash', (args) => {
        game.sendCash(socket, args)
    })

    socket.on('putother', ({putId, putCash}) => {
        game.putOther(socket, putId, putCash);
    })

    socket.on('opencard', () => {
        game.openCard(socket);
    })

    socket.on('disconnect', () => {
        game.disconnect(socket);
    })

    socket.on('changepos', (args) => {
        game.changePos(socket, args);
    })

    socket.on('sendother', ({recipientId, recipientCash}) => {
        game.sendOther(socket, recipientId, recipientCash)
    })

    socket.on('changepos', ({pos}) => {
        game.changePos(socket, pos)
    })
})