const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    }
});

server.listen(process.env.PORT || 8021);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const calculatePoint = (cards) => {

    let point2 = 0, point1 = 0;
    if(cards[0].point === cards[1].point && cards[1].point === cards[2].point) {
        point1 = 11;
        point2 = cards[1].point === 1 ? 10 : cards[1].point;
    } else {
        const maxPointList = {
            "ro": 0,
            "co": 0,
            "tep": 0,
            "bich": 0
        };
        for(let i = 0; i<cards.length; i++) {
            point1 += cards[i].point;
            const point = cards[i].point === 1 ? 10 : cards[i].point;
            if(point > maxPointList[cards[i].type]) {
                maxPointList[cards[i].type] = point;
            }
        }
        
        point2 = maxPointList["ro"] * 1000000 + maxPointList["co"] * 10000 +  maxPointList["tep"] * 100 +  maxPointList["bich"]; 
        point1 = point1%10 === 0 ? 10 : point1%10;
    }
    
    return {point1, point2};
}

const dealingCard = (numPlayer) => {
    const listCard = [];
    const dealedCard = [];
    for(let i = 1; i<10; i++) {
        listCard.push({point: i, type: "ro"});
        listCard.push({point: i, type: "co"});
        listCard.push({point: i, type: "tep"});
        listCard.push({point: i, type: "bich"});
    }
    for(let i = 0; i<numPlayer; i++) {
        const threeCards = {
            point1: 0,
            point2: 0,
            cards: []
        };
        for(let i = 0; i<3; i++) {
            const randomNumber = Math.floor(Math.random() * listCard.length);
            threeCards.cards.push(listCard[randomNumber]);
            listCard.splice(randomNumber, 1);
        }
        const {point1, point2} = calculatePoint(threeCards.cards);
        threeCards.point1 = point1;
        threeCards.point2 = point2;
        dealedCard.push(threeCards);
    }
    shuffleArray(dealedCard);
    return dealedCard;
}

let isPlayed = false;
let listPlayer = [];
const mapPlayer = {};
let master;
let maxCash = 5000;

io.on('connection', (socket) => {
    socket.emit('update', listPlayer);

    socket.on('join', ({name, pos, cash}) => {
        if(mapPlayer[socket.id]) {
            mapPlayer[socket.id].pos = pos;
            io.sockets.emit('update', listPlayer);
            return;
        }

        if(isPlayed) {
            socket.emit('join', 'fail');
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
            isMaster: listPlayer.length === 0 ? true : false
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

    const handleCheckOpenFullCard = (listPlayer, master) => {
        for(let i = 0; i<listPlayer.length; i++) {
            if(!listPlayer[i].isOpened) {
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
        io.to(recipientId).emit('log', {type: "win", message: `Bạn được ${mapPlayer[socket.id].name} tặng ${recipientCash} đ`})
        socket.emit('log', {message: "Gửi tiền thành công"});
        io.sockets.emit('update', listPlayer);
    })
})

const comparePoint = (master, player) => {
    if(master.cards.point1 > player.cards.point1 || (master.cards.point1 === player.cards.point1 && master.cards.point2 > player.cards.point2)) {
        if(master.cards.point1 === 11) {
           player.cash -= player.cashSended * 3;
           io.to(player.socketId).emit('log', {type: "lose", message: "Bạn bị trừ " + player.cashSended * 3 + "đ"});
           return player.cashSended * 3;
        } else if(master.cards.point1 === 10) {
            player.cash -= player.cashSended * 2;
            io.to(player.socketId).emit('log', {type: "lose", message: "Bạn bị trừ " + player.cashSended * 2 + "đ"});
            return player.cashSended * 2;
        } else {
            player.cash -= player.cashSended;
            io.to(player.socketId).emit('log', {type: "lose", message: "Bạn bị trừ " + player.cashSended + "đ"});
            return player.cashSended;
        }
    }  else {
        if(player.cards.point1 === 11) {
            player.cash += player.cashSended * 3;
            io.to(player.socketId).emit('log', {type: "win", message: "Bạn được nhận " + player.cashSended * 3 + "đ"});
            return -player.cashSended * 3;
        } else if(player.cards.point1 === 10) {
            player.cash += player.cashSended * 2;
            io.to(player.socketId).emit('log',{type: "win", message: "Bạn được nhận " + player.cashSended * 2 + "đ"});
            return -player.cashSended * 2;
        } else {
            player.cash += player.cashSended;
            io.to(player.socketId).emit('log', {type: "win", message: "Bạn được nhận " + player.cashSended + "đ"});
            return -player.cashSended;
        }
    }
}

const handleEndTurn = (listPlayer, master) => {
    if(!master) return;
    let masterCash = 0;
    for(let i = 0; i<listPlayer.length; i++) {
        if(!listPlayer[i].isMaster) {
            masterCash += comparePoint(master, listPlayer[i])
        }
    }
    master.cash += masterCash;
    io.to(master.socketId).emit("log", {type: masterCash > 0 ? "win" : "lose", message: `Bạn ${masterCash > 0 ? "được nhận" : "bị trừ"} ${masterCash}`} )
}
