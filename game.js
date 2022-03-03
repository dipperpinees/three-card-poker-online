const Player = require("./player");
const {dealingCard} = require("./card");

module.exports = class Game { 
    constructor (io) {
        this.isPlayed = false;
        this.listPlayer = [];
        this.mapPlayer = {};
        this.master;
        this.maxCash = 5000;
        this.io = io;
        this.isEndTurn = false;
    }

    comparePoint (player){
        if(!this.master) return 0;
        if(this.master.cards.point1 > player.cards.point1 || (this.master.cards.point1 === player.cards.point1 && this.master.cards.point2 > player.cards.point2)) {
            if(this.master.cards.point1 === 11) {
               return player.cashSended * 3;
            } else if(this.master.cards.point1 === 10) {
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

    sendCashMessage (socketId, type, cash) {
        const message =  type === "win" ? `Bạn được nhận ${cash} đ` : `Bạn bị trừ ${cash} đ`;
        this.io.to(socketId).emit('alert', {type, message});
    }

    comparePutCash (player, putCash) {
        if(!this.master || !player) return 0;
        if(this.master.cards.point1 > player.cards.point1 || (this.master.cards.point1 === player.cards.point1 && this.master.cards.point2 > player.cards.point2)) {
            if(this.master.cards.point1 === 11) {
               return putCash * 3;
            } else if(this.master.cards.point1 === 10) {
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

    handleEndTurn () {
        if(!this.master || this.isEndTurn) return;
        let masterCash = 0;
        this.listPlayer.forEach((player) => {
            if(!player.isMaster) {
                let thisTurnCash = 0;
                thisTurnCash += this.comparePoint(player);
                player.putOther.forEach(({putCash, putId}) => {
                    thisTurnCash += this.comparePutCash(this.mapPlayer?.[putId], putCash);
                })
                masterCash += thisTurnCash;
                player.earnCash(thisTurnCash * -1);
                this.sendCashMessage(player.socketId, thisTurnCash * -1 > 0 && "win", thisTurnCash * -1);
            }
        })
        this.isEndTurn = true;
        this.master.earnCash(masterCash);
        this.sendCashMessage(this.master.socketId, masterCash > 0 && "win", masterCash);
    }

    handleCheckOpenFullCard () {
        for(let i = 0; i<this.listPlayer.length; i++) {
            if(!this.listPlayer[i].isOpened) {
                return;
            }
        }
        this.handleEndTurn();
        this.update();
        setTimeout(() => {
            this.io.to(this.master?.socketId).emit('newturn')
        }, 2000)
    }

    update () {
        this.io.sockets.emit('update', this.listPlayer);
    }

    playerJoin (socket, name, pos, cash, avatar) {
        if(this.isPlayed) {
            socket.emit('alert', {message: "Đợi game kết thúc"});
            return;
        }

        const thisPlayer = new Player(name, pos, Number(cash) || 0, avatar, socket.id, this.listPlayer.length === 0)

        if(thisPlayer.isMaster) {
            this.master = thisPlayer;
        }

        this.listPlayer.push(thisPlayer);
        this.mapPlayer[socket.id] = thisPlayer;

        socket.join('room');
        socket.emit('join', thisPlayer);
        this.update();
    }

    reset () {
        this.isPlayed = false;
        this.isEndTurn = false;
        this.listPlayer.forEach((player) => {
            player.reset();
        })
        this.update();
        this.io.sockets.emit('clear');
    }

    pleaseMaster (socket) {
        if(!this.master) {
            this.mapPlayer[socket.id].isMaster = true;
            this.master = this.mapPlayer[socket.id];
            this.update();
            socket.emit("newmaster");
            return;
        }
        this.io.to(this.master.socketId).emit('askmaster', {name: this.mapPlayer[socket.id].name, socketId: socket.id});
    }

    changeMaster (socket, newMasterId) {
        if(socket.id === this.master.socketId) {
            this.master.isMaster = false;
            this.mapPlayer[newMasterId].isMaster = true;
            this.master = this.mapPlayer[newMasterId];
            socket.emit("notmaster")
            this.update();
            this.io.to(newMasterId).emit("newmaster")
        }
    }

    start () {
        this.isPlayed = true;
        const dealedCard = dealingCard(this.listPlayer.length);
        for(let i = 0; i < this.listPlayer.length; i++) {
            this.io.to(this.listPlayer[i].socketId).emit('dealcard', dealedCard[i]);
            this.listPlayer[i].cards = dealedCard[i];
        }
        this.io.sockets.emit('start');
    }

    newMaxCash (socket, maxCash) {
        if(this.master?.socketId === socket.id) {
            this.maxCash = Number(maxCash);
            for(let i = 0; i<this.listPlayer.length; i++) {
                if(this.listPlayer[i].cashSended > Number(maxCash)) {
                    this.listPlayer[i].cashSended = Number(maxCash);
                }
            }
            this.update();
            this.io.sockets.emit('maxcash', Number(maxCash));
        }
    }

    sendCash (socket, cash) {
        if(Number(cash) + this.mapPlayer?.[socket.id]?.cashOther > this.maxCash) {
            socket.emit("alert", {message: "Số tiền vượt quá giới hạn"}) 
            return;
        }
        this.mapPlayer[socket.id].cashSended = Number(cash);
        this.update();
    }

    putOther (socket, putId, putCash) {
        if(socket.id === this.master?.socketId || putId === this.master?.socketId || !this.mapPlayer[putId]) {
            return;
        }

        if(putCash < 1000) {
            socket.emit('alert', {message: 'Lỗi! Số tiền tối thiểu 1000đ'})
            return;
        }

        if(this.mapPlayer?.[putId]?.cashSended + this.mapPlayer?.[putId]?.cashOther  + putCash > this.maxCash) {
            socket.emit('alert', {message: 'Số tiền người được đặt vượt quá giới hạn'})
            return;
        }

        if(this.isPlayed) {
            socket.emit('alert', {message: 'Lỗi! Game đã bắt đầu'})
            return;
        }

        if(this.mapPlayer[socket.id].putOther.length > 1) {
            socket.emit('alert', {message: 'Chỉ được đặt nhờ tối đa 2 nhà'})
            return;
        }

        this.mapPlayer[putId].cashOther += putCash;
        this.mapPlayer[socket.id].putOther.push({putId, putCash});
        socket.emit("alert", {message: `Đặt nhờ thành công`})
        this.io.to(putId).emit("alert", {message: `${this.mapPlayer[socket.id].name} đặt nhờ bạn ${putCash}đ`});
        this.update();
    }

    openCard (socket) {
        this.mapPlayer[socket.id].isOpened = true;
        this.update();
        this.handleCheckOpenFullCard();
    }

    disconnect (socket) {
        if(!this.mapPlayer[socket.id]) {
            return;
        }
        if(this.master?.socketId === socket.id) {
            this.master = null;
            this.isPlayed = false;
            this.listPlayer.forEach((player) => {
                player.reset();
            })
            this.io.sockets.emit('clear');
        }
        this.listPlayer = this.listPlayer.filter((player) => player.socketId !== socket.id);
        if(this.isPlayed && !this.mapPlayer[socket.id].isOpened) {
            this.handleCheckOpenFullCard();
        }
        delete this.mapPlayer[socket.id];
        this.update();
        if(this.listPlayer.length === 0) {
            this.isPlayed = false;
        }
    }

    sendOther (socket, recipientId, recipientCash) {
        if(Number(recipientCash) < 1000) {
            socket.emit('sendother', 'fail')
            return;
        }
        this.mapPlayer[socket.id].earnCash(-Number(recipientCash));
        this.mapPlayer[recipientId].earnCash(Number(recipientCash));
        this.io.to(recipientId).emit('alert', {type: "win", message: `Bạn được ${this.mapPlayer[socket.id].name} tặng ${recipientCash} đ`})
        socket.emit('alert', {message: "Gửi tiền thành công"});
        this.update();
    }

    changePos (socket, pos) {
        if(this.mapPlayer[socket.id]) {
            this.mapPlayer[socket.id].changePos(pos);
            this.update();
        } else {
            socket.emit("joinform");
        }
    }
}