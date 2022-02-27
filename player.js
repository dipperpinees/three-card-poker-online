module.exports = class Player {
    constructor (name, pos, cash, avatar, socketId, isMaster) {
        this.name = name;
        this.pos = pos;
        this.isMaster = isMaster;
        this.cash = cash;
        this.avatar = avatar || "https://i.ibb.co/6Wkjgmx/poker-cards.png";
        this.socketId = socketId;
        this.cashSended = 1000;
        this.isOpened = false;
        this.cards = [];
        this.cashOther = 0;
        this.putOther = [];
        this.earn = null;
        // this.emoji = this.cash >= 100000 ? "rich" : (this.cash <= -100000 ? "poor" : null);
    }
    earnCash (cash) {
        this.cash += cash;
        this.earn = cash;
    }
    reset () {
        this.cards = [];
        this.isOpened = false;
        this.cashOther = 0;
        this.putOther = [];
        this.earn = null;
    }
    changePos (pos) {
        this.pos = pos;
    }
    openCard () {
        this.isOpened = true;
    }
}