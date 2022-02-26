module.exports = class Player {
    constructor (name, pos, cash, avatar, socketId, isMaster) {
        this.name = name;
        this.pos = pos;
        this.isMaster = isMaster;
        this.cash = cash;
        this.avatar = avatar || "https://i.ibb.co/0c34PcQ/playing-cards.png";
        this.socketId = socketId;
        this.cashSended = 1000;
        this.isOpened = false;
        this.cards = [];
        this.cashOther = 0;
        this.putOther = [];
        this.emoji = this.cash >= 100000 ? "rich" : (this.cash <= -100000 ? "poor" : null);
    }
    earnCash (cash) {
        this.cash += cash;
        if(this.cash >= 100000) {
            this.emoji = "rich";
        } else if(this <= -100000) {
            this.emoji = "poor";
        }
    }
    reset () {
        this.cards = [];
        this.isOpened = false;
        this.cashOther = 0;
        this.putOther = [];
    }
    changePos (pos) {
        this.pos = pos;
    }
    openCard () {
        this.isOpened = true;
    }
}