const express = require("express");
const app = express();
const {dealingCard} = require("./card");
const server = require("http").Server(app);
require('dotenv').config()
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    }
});

server.listen(process.env.PORT || 8021);

let isPlayed = false;
let listPlayer = [];
const mapPlayer = {};
let master;
let maxCash = 5000;

app.get("/reset/:pass", (req, res) => {
    if(req.params.pass === process.env.PASS) {
        res.send("success");
        listPlayer.forEach(player => {
            player.cash = 0;
        })
        io.sockets.emit('update', listPlayer);
    } else {
        res.send("wrong password");
    }
})

io.on('connection', (socket) => {
    socket.emit('update', listPlayer);

    socket.on('join', ({name, pos, cash, avatar}) => {
        if(mapPlayer[socket.id]) {
            mapPlayer[socket.id].pos = pos;
            io.sockets.emit('update', listPlayer);
            return;
        }
        if(isPlayed) {
            socket.emit('alert', {message: "Đợi game kết thúc"});
            return;
        }

        const thisPlayer = {
            name: name,
            cash: Number(cash) || 0,
            socketId: socket.id,
            cashSended: 1000,
            isOpened: false,
            cards: [],
            pos: pos,
            avatar: avatar || "https://cdn-icons-png.flaticon.com/512/3004/3004163.png",
            cashOther: 0,
            putOther: [],
            isMaster: listPlayer.length === 0 ? true : false,
        }

        if(thisPlayer.isMaster) {
            master = thisPlayer;
        }

        listPlayer.push(thisPlayer);
        mapPlayer[socket.id] = thisPlayer;

        socket.join('room');
        socket.emit('join', thisPlayer);
        // io.to('room').emit('update', listPlayer)
        io.sockets.emit('update', listPlayer);
    })

    socket.on('reset', (args) => {
	    isPlayed = false;
        for(let i = 0; i<listPlayer.length; i++) {
            listPlayer[i].cards = [];
            listPlayer[i].isOpened = false;
            listPlayer[i].cashOther = 0;
            listPlayer[i].putOther = [];
        }
        io.sockets.emit('update', listPlayer);
        io.to(master.socketId).emit('start');
        io.sockets.emit('clear');
    })

    socket.on('askmaster', (args) => {
        if(!master) {
            mapPlayer[socket.id].isMaster = true;
            master = mapPlayer[socket.id];
            io.sockets.emit('update', listPlayer);
            socket.emit("newmaster");
            return;
        }
        io.to(master.socketId).emit('askmaster', {name: mapPlayer[socket.id].name, socketId: socket.id});
    })

    socket.on('changemaster', (args) => {
        if(socket.id === master.socketId) {
            master.isMaster = false;
            mapPlayer[args].isMaster = true;
            master = mapPlayer[args];
            io.sockets.emit('update', listPlayer);
            io.to(args).emit("newmaster")
        }
    })

    socket.on('start', (args) => {
        isPlayed = true;
        const dealedCard = dealingCard(listPlayer.length);
        for(let i = 0; i < listPlayer.length; i++) {
            io.to(listPlayer[i].socketId).emit('dealcard', dealedCard[i]);
            listPlayer[i].cards = dealedCard[i];
        }
        io.sockets.emit('start');
    })

    socket.on('maxcash', (args) => {
        if(master?.socketId === socket.id) {
            maxCash = Number(args);
            for(let i = 0; i<listPlayer.length; i++) {
                if(listPlayer[i].cashSended > Number(args)) {
                    listPlayer[i].cashSended = Number(args);
                }
            }
            io.sockets.emit('update', listPlayer);
            io.sockets.emit('maxcash', Number(args));
        }
    })

    socket.on('sendcash', (args) => {
        if(Number(args) > maxCash) {
            args = maxCash;
        }
        mapPlayer[socket.id].cashSended = Number(args);
        io.sockets.emit('update', listPlayer);
    })

    socket.on('putother', ({putId, putCash}) => {
        if(isPlayed) {
            socket.emit('alert', {message: 'Lỗi! Game đã bắt đầu'})
            return;
        }

        if(mapPlayer[socket.id].putOther.length > 0) {
            socket.emit('alert', {message: 'Chỉ được đặt nhờ 1 nhà'})
            return;
        }

        if(mapPlayer?.[putId].cashSended + Number(putCash) > maxCash) {
            socket.emit('alert', {message: 'Người được gửi số tiền đặt vượt quá giới hạn'})
            return;
        }

        if(socket.id === master?.socketId) {
            return;
        }
        mapPlayer[putId].cashOther += Number(putCash);
        mapPlayer[socket.id].putOther.push({putId, putCash});
        io.to(putId).emit("alert", {message: `${mapPlayer[socket.id].name} đặt nhờ ${putCash}`});
        io.sockets.emit('update', listPlayer);
        socket.emit("alert", {message: "Đặt nhờ thành công"})
    })

    const handleCheckOpenFullCard = (listPlayer, master) => {
        for(let i = 0; i<listPlayer.length; i++) {
            if(!listPlayer[i]?.isOpened) {
                return;
            }
        }
        handleEndTurn(listPlayer, master);
        io.sockets.emit('update', listPlayer);

        setTimeout(() => {
            io.to(master?.socketId).emit('newturn')
        }, 4000)
    }

    socket.on('opencard', () => {
        mapPlayer[socket.id].isOpened = true;
        io.sockets.emit('update', listPlayer);
        handleCheckOpenFullCard(listPlayer, master);
    })

    socket.on('disconnect', () => {
        if(!mapPlayer[socket.id]) {
            return;
        }
        if(master?.socketId === socket.id) {
            master = null;
            isPlayed = false;
            for(let i = 0; i < listPlayer.length; i++) {
                listPlayer[i].cards = [];
                listPlayer[i].isOpened = false;
            }
            io.sockets.emit('clear');
        }
        listPlayer = listPlayer.filter((player) => player.socketId !== socket.id);
        if(isPlayed && !mapPlayer[socket.id].isOpened) {
            handleCheckOpenFullCard(listPlayer, master);
        }
        delete mapPlayer[socket.id];
        io.sockets.emit('update', listPlayer);
        if(listPlayer.length === 0) {
            isPlayed = false;
        }
    })

    socket.on('changepos', (args) => {
        if(!mapPlayer[socket.id]) {
            return;
        }
        mapPlayer[socket.id].pos = args;
        io.sockets.emit('update', listPlayer);
    })

    socket.on('sendother', ({recipientId, recipientCash}) => {
        if(mapPlayer[socket.id].cash < Number(recipientCash)) {
            socket.emit('sendother', 'fail')
            return;
        }
        mapPlayer[socket.id].cash -= Number(recipientCash);
        mapPlayer[recipientId].cash += Number(recipientCash);
        io.to(recipientId).emit('alert', {type: "win", message: `Bạn được ${mapPlayer[socket.id].name} tặng ${recipientCash} đ`})
        socket.emit('alert', {message: "Gửi tiền thành công"});
        io.sockets.emit('update', listPlayer);
    })
})

const sendCashMessage = (socketId, type, cash) => {
    const message =  type === "win" ? `Bạn được nhận ${cash} đ` : `Bạn bị trừ ${cash} đ`;
    io.to(socketId).emit('alert', {type, message});
}

const comparePoint = (master, player) => {
    if(!master) return 0;
    if(master.cards.point1 > player.cards.point1 || (master.cards.point1 === player.cards.point1 && master.cards.point2 > player.cards.point2)) {
        if(master.cards.point1 === 11) {
           return player.cashSended * 3;
        } else if(master.cards.point1 === 10) {
            return player.cashSended * 2;
        } else {
            return player.cashSended;
        }
    }  else {
        if(player.cards.point1 === 11) {
            return -player.cashSended * 3;
        } else if(player.cards.point1 === 10) {
            return -player.cashSended * 2;
        } else {
            return -player.cashSended;
        }
    }
}

//player1 là người được đặt nhờ, player2 là người đặt nhờ
const comparePutCash = (master, player, putCash) => {
    if(!master || !player) return 0;
    if(master.cards.point1 > player.cards.point1 || (master.cards.point1 === player.cards.point1 && master.cards.point2 > player.cards.point2)) {
        if(master.cards.point1 === 11) {
           return putCash * 3;
        } else if(master.cards.point1 === 10) {
            return putCash * 2;
        } else {
            return putCash;
        }
    }  else {
        if(player.cards.point1 === 11) {
            return -putCash * 3;
        } else if(player.cards.point1 === 10) {
            return -putCash * 2;
        } else {
            return -putCash;
        }
    }
}

const handleEndTurn = (listPlayer, master) => {
    if(!master) return;
    let masterCash = 0;
    for(let i = 0; i<listPlayer.length; i++) {
        if(!listPlayer[i].isMaster) {
            let thisTurnCash = 0;
            thisTurnCash += comparePoint(master, listPlayer[i]);
            listPlayer[i].putOther.forEach(({putCash, putId}) => {
                thisTurnCash += comparePutCash(master, mapPlayer?.[putId], putCash);
            })
            masterCash += thisTurnCash;
            listPlayer[i].cash += thisTurnCash * -1;
            sendCashMessage(listPlayer[i].socketId, thisTurnCash * -1 > 0 && "win", thisTurnCash * -1);
            // masterCash += comparePutCash(master, )
        }
    }
    master.cash += masterCash;
    sendCashMessage(master.socketId, masterCash > 0 && "win", masterCash);
}