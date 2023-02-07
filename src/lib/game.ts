import Player from './player';
import dealingCard from './card';
import * as socketio from 'socket.io';

class Contribute {
    players: Player[] = [];
    winPlayer?: Player;
    cash: number = 1000;
}

type MapPlayer = {
    [id: string]: Player;
};

export default class Game {
    io: socketio.Server;
    isPlayed: boolean = false;
    listPlayer: Player[] = [];
    mapPlayer: MapPlayer = {};
    master?: Player;
    maxCash: number = 5000;
    contribute: Contribute = new Contribute();
    isEndTurn: boolean = false;

    constructor(io: socketio.Server) {
        this.io = io;
    }

    comparePoint(player: Player) {
        if (!this.master) return 0;
        if (
            this.master.cards.point1 > player.cards.point1 ||
            (this.master.cards.point1 === player.cards.point1 &&
                this.master.cards.point2 > player.cards.point2)
        ) {
            if (this.master.cards.point1 === 11) {
                return player.cashSended * 3;
            } else if (this.master.cards.point1 === 10) {
                return player.cashSended * 2;
            } else {
                return player.cashSended;
            }
        } else {
            if (player.cards.point1 === 11) {
                return -player.cashSended * 3;
            } else if (player.cards.point1 === 10) {
                return -player.cashSended * 2;
            } else {
                return -player.cashSended;
            }
        }
    }

    sendCashMessage(socketId: string, type: string | undefined, cash: number) {
        const message = type === 'win' ? `Bạn được nhận ${cash} đ` : `Bạn bị trừ ${cash} đ`;
        this.io.to(socketId).emit('alert', { type, message });
    }

    comparePutCash(player: Player, putCash: number) {
        if (!this.master || !player) return 0;
        if (player === this.master) return 0;
        if (
            this.master.cards.point1 > player.cards.point1 ||
            (this.master.cards.point1 === player.cards.point1 &&
                this.master.cards.point2 > player.cards.point2)
        ) {
            if (this.master.cards.point1 === 11) {
                return putCash * 3;
            } else if (this.master.cards.point1 === 10) {
                return putCash * 2;
            } else {
                return putCash;
            }
        } else {
            if (player.cards.point1 === 11) {
                return -putCash * 3;
            } else if (player.cards.point1 === 10) {
                return -putCash * 2;
            } else {
                return -putCash;
            }
        }
    }

    handleEndTurn() {
        if (!this.master || this.isEndTurn) return;
        let masterCash = 0;
        this.listPlayer.forEach((player) => {
            if (!player.isMaster) {
                let thisTurnCash = 0;
                thisTurnCash += this.comparePoint(player);
                player.putOther.forEach(({ putCash, putId }) => {
                    thisTurnCash += this.comparePutCash(this.mapPlayer?.[putId], putCash);
                });
                masterCash += thisTurnCash;
                player.earnCash(thisTurnCash * -1);
                this.sendCashMessage(
                    player.socketId,
                    thisTurnCash * -1 > 0 ? 'win' : undefined,
                    thisTurnCash * -1
                );
            }
        });
        this.isEndTurn = true;
        this.master.earnCash(masterCash);
        this.sendCashMessage(this.master.socketId, masterCash > 0 ? 'win' : undefined, masterCash);
        this.compareContribute();
        this.updateContribute();
    }

    handleCheckOpenFullCard() {
        for (let i = 0; i < this.listPlayer.length; i++) {
            if (!this.listPlayer[i].isOpened) {
                return;
            }
        }
        this.handleEndTurn();
        this.update();
        setTimeout(() => {
            this.master && this.io.to(this.master.socketId).emit('new-turn');
        }, 2000);
    }

    update() {
        this.io.sockets.emit('update', this.listPlayer);
    }

    addPlayer(socket: socketio.Socket, name: string, pos: number, cash: number, avatar: string) {
        if (this.isPlayed) {
            socket.emit('alert', { message: 'Đợi game kết thúc' });
            return;
        }

        const newPlayer = new Player(
            name,
            pos,
            cash,
            avatar,
            socket.id,
            this.listPlayer.length === 0
        );

        if (newPlayer.isMaster) {
            this.master = newPlayer;
        }

        this.listPlayer.push(newPlayer);
        this.mapPlayer[newPlayer.socketId] = newPlayer;

        socket.join('room');
        socket.emit('join', newPlayer);
        this.update();
    }

    reset() {
        this.isPlayed = false;
        this.isEndTurn = false;
        this.contribute.players = [];
        this.contribute.winPlayer = undefined;
        this.listPlayer.forEach((player) => {
            player.reset();
            player.contribute = false;
        });
        this.update();
        this.updateContribute();
        this.io.sockets.emit('clear');
    }

    pleaseMaster(socket: socketio.Socket) {
        if (!this.statusPlayer(socket.id)) return;
        if (!this.master) {
            this.mapPlayer[socket.id].isMaster = true;
            this.master = this.mapPlayer[socket.id];
            this.update();
            socket.emit('new-master');
            return;
        }
        this.io.to(this.master.socketId).emit('ask-master', {
            name: this.mapPlayer[socket.id].name,
            socketId: socket.id,
        });
    }

    changeMaster(socket: socketio.Socket, newMasterId: string) {
        if (!this.statusPlayer(socket.id)) return;
        if (socket.id === this.master?.socketId) {
            this.master.isMaster = false;
            this.mapPlayer[newMasterId].isMaster = true;
            this.master = this.mapPlayer[newMasterId];
            socket.emit('not-master');
            this.update();
            this.io.to(newMasterId).emit('new-master');
            socket.broadcast.emit('alert', {
                message: `${this.mapPlayer[newMasterId].name} được chuyển làm cái`,
            });
        }
    }

    start() {
        this.isPlayed = true;
        const dealedCard = dealingCard(this.listPlayer.length);
        for (let i = 0; i < this.listPlayer.length; i++) {
            this.io.to(this.listPlayer[i].socketId).emit('deal-card', dealedCard[i]);
            this.listPlayer[i].cards = dealedCard[i];
        }
        this.io.sockets.emit('start');
    }

    sendCash(socket: socketio.Socket, cash: number) {
        if (!this.statusPlayer(socket.id)) return;
        if (Number(cash) + this.mapPlayer?.[socket.id]?.cashOther > this.maxCash) {
            socket.emit('alert', { message: 'Số tiền vượt quá giới hạn' });
            return;
        }
        this.mapPlayer[socket.id].cashSended = Number(cash);
        this.update();
    }

    putOther(socket: socketio.Socket, putId: string, putCash: number) {
        if (!this.statusPlayer(socket.id)) return;
        if (
            socket.id === this.master?.socketId ||
            putId === this.master?.socketId ||
            !this.mapPlayer[putId]
        ) {
            return;
        }

        if (putCash < 1000) {
            socket.emit('alert', { message: 'Lỗi! Số tiền tối thiểu 1000đ' });
            return;
        }

        if (
            this.mapPlayer?.[putId]?.cashSended + this.mapPlayer?.[putId]?.cashOther + putCash >
            this.maxCash
        ) {
            socket.emit('alert', {
                message: 'Số tiền người được đặt vượt quá giới hạn',
            });
            return;
        }

        if (this.isPlayed) {
            socket.emit('alert', { message: 'Lỗi! Game đã bắt đầu' });
            return;
        }

        if (this.mapPlayer[socket.id].putOther.length > 1) {
            socket.emit('alert', { message: 'Chỉ được đặt nhờ tối đa 2 nhà' });
            return;
        }

        this.mapPlayer[putId].cashOther += putCash;
        this.mapPlayer[socket.id].putOther.push({ putId, putCash });
        socket.emit('alert', { message: `Đặt nhờ thành công` });
        this.io.to(putId).emit('alert', {
            message: `${this.mapPlayer[socket.id].name} đặt nhờ bạn ${putCash}đ`,
        });
        this.update();
    }

    openCard(socket: socketio.Socket) {
        if (!this.statusPlayer(socket.id)) return;
        this.mapPlayer[socket.id].isOpened = true;
        this.update();
        this.handleCheckOpenFullCard();
    }

    disconnect(socket: socketio.Socket) {
        if (!this.mapPlayer[socket.id]) {
            return;
        }
        if (this.master?.socketId === socket.id) {
            if (this.isPlayed) {
                this.contribute.players = [];
                this.contribute.winPlayer = undefined;
                this.listPlayer.forEach((player) => {
                    player.contribute = false;
                });
                this.updateContribute();
            }
            this.master = undefined;
            this.reset();
            this.isPlayed = false;
            this.isEndTurn = false;
            this.listPlayer.forEach((player) => {
                player.reset();
            });
            this.update();
            this.io.sockets.emit('clear');
        }
        this.listPlayer = this.listPlayer.filter((player) => player.socketId !== socket.id);
        if (this.isPlayed && !this.mapPlayer[socket.id].isOpened) {
            this.handleCheckOpenFullCard();
        }
        if (this.mapPlayer[socket.id].contribute) {
            this.contribute.players = this.contribute?.players?.filter(
                (player) => player.socketId !== socket.id
            );
            this.updateContribute();
        }
        delete this.mapPlayer[socket.id];
        this.update();
        if (this.listPlayer.length === 0) {
            this.isPlayed = false;
        }
    }

    sendOther(socket: socketio.Socket, recipientId: string, recipientCash: number) {
        if (!this.statusPlayer(socket.id)) return;
        if (recipientCash < 1000) {
            socket.emit('send-other', 'fail');
            return;
        }
        this.mapPlayer[socket.id].earnCash(-recipientCash);
        this.mapPlayer[recipientId].earnCash(recipientCash);
        this.io.to(recipientId).emit('alert', {
            type: 'win',
            message: `Bạn được ${this.mapPlayer[socket.id].name} tặng ${recipientCash} đ`,
        });
        socket.emit('alert', { message: 'Gửi tiền thành công' });
        this.update();
    }

    changePos(socket: socketio.Socket, pos: number) {
        if (this.mapPlayer[socket.id]) {
            this.mapPlayer[socket.id].changePos(pos);
            this.update();
        } else {
            socket.emit('join-room');
        }
    }

    contributeCash(socket: socketio.Socket) {
        if (!this.statusPlayer(socket.id)) return;
        if (this.mapPlayer[socket.id].contribute) {
            socket.emit('alert', { message: 'Góp gà thất bại' });
            return;
        }
        this.mapPlayer[socket.id].cash -= this.contribute.cash;
        this.contribute?.players?.push(this.mapPlayer[socket.id]);
        this.mapPlayer[socket.id].contribute = true;
        socket.emit('alert', { message: 'Góp gà thành công' });
        this.update();
        this.updateContribute();
    }

    compareContribute() {
        const { players } = this.contribute;
        if (!players) return;
        if (players.length === 0) return;
        let winPlayer = players[0];
        for (let i = 1; i < players.length; i++) {
            if (
                players[i].cards.point1 > winPlayer.cards.point1 ||
                (players[i].cards.point1 === winPlayer.cards.point1 &&
                    players[i].cards.point2 > winPlayer.cards.point2)
            ) {
                winPlayer = players[i];
            }
        }
        winPlayer.cash += players.length * this.contribute.cash;
        if (winPlayer.earn) winPlayer.earn += players.length * this.contribute.cash;
        this.contribute.winPlayer = winPlayer;
        this.io.to(winPlayer.socketId).emit('alert', {
            message: `Nhận được ${players.length * this.contribute.cash}đ tiền góp gà`,
            type: 'win',
        });
    }

    updateContribute() {
        this.io.sockets.emit('contribute', this.contribute);
    }

    changeCashContribute(args: number) {
        this.contribute.cash = args;
    }

    statusPlayer(socketId: string) {
        if (!this.mapPlayer[socketId]) return false;
        return true;
    }
}
