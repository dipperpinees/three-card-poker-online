module.exports = class Game { 
    constructor (io) {
        this.isPlayed = false;
        this.listPlayer = [];
        this.mapPlayer = {};
        this.master;
        this.maxCash = 5000;
        this.io = io;
    }
    play() {
        this.isPlayed = true;
    }
    notPlay() {
        this.isPlayed = false;
    }
    reset() {
        this.isPlayed = false;
        listPlayer.forEach((player) => {
            player.reset();
        })
    }
    comparePoint (player) {
        if(!this.master) return 0;
        if(this.master.cards.point1 > player.cards.point1 
            || (this.master.cards.point1 === player.cards.point1 && this.master.cards.point2 > player.cards.point2)) {
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
    comparePutCash (player, putCash) {
        if(!this.master || !player) return 0;
        if(this.master.cards.point1 > player.cards.point1 
            || (this.master.cards.point1 === player.cards.point1 && this.master.cards.point2 > player.cards.point2)
            ) {
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
    setMaster(socketId) {
        this.master = this.mapPlayer[socketId];
        this.mapPlayer[socketId].isMaster = true;
    }

    updateGame() {
        this.io.sockets.emit('update', listPlayer);
    }

    handleCheckOpenFullCard () {
        for(let i = 0; i<this.listPlayer.length; i++) {
            if(!this.listPlayer[i].isOpened) {
                return;
            }
        }
        handleEndTurn();
        updateGame()
        setTimeout(() => {
            this.io.to(this.master?.socketId).emit('newturn')
        }, 4000)
    }
    handleEndTurn () {
        if(!this.master) return;
        let masterCash = 0;
        this.listPlayer.forEach((player) => {
            if(!player.isMaster) {
                let thisTurnCash = 0;
                thisTurnCash += this.comparePoint(player);
                player.putOther.forEach(({putCash, putId}) => {
                    thisTurnCash += comparePutCash(this.mapPlayer?.[putId], putCash);
                })
                masterCash += thisTurnCash;
                player.earnCash(thisTurnCash * -1);
                this.sendCashMessage(player.socketId, thisTurnCash * -1 > 0 && "win", thisTurnCash * -1);
            }
        })
        this.master.earnCash(masterCash);
        this.sendCashMessage(master.socketId, masterCash > 0 && "win", masterCash);
    }
    sendCashMessage (socketId, type, cash) {
        const message =  type === "win" ? `Bạn được nhận ${cash} đ` : `Bạn bị trừ ${cash} đ`;
        io.to(socketId).emit('alert', {type, message});
    }
}