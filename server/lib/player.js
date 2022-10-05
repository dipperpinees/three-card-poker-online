module.exports = class Player {
    constructor (name, pos, cash, avatar, socketId, isMaster) {
        this.name = name;
        this.pos = pos;
        this.isMaster = isMaster;
        this.cash = cash;
        this.avatar = avatar || "https://i.ibb.co/YBKWdYw/playing-cards-1.png";
        this.socketId = socketId;
        this.cashSended = 1000;
        this.isOpened = false;
        this.cards = [];
        this.cashOther = 0;
        this.putOther = [];
        this.earn = null;
        this.contribute = false;
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
        this.contribute = false;
    }
    changePos (pos) {
        this.pos = pos;
    }
    openCard () {
        this.isOpened = true;     
    }
    isImgLink = (url) => {
        if (typeof url !== 'string') {
          return false;
        }
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) !== null);
    }
}