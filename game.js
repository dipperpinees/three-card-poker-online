module.exports = class Game { 
    constructor () {
        this.isPlayed = false;
        this.listPlayer = [];
        this.mapPlayer = {};
        this.master;
        this.maxCash = 5000;
    }
    play() {
        this.isPlayed = true;
    }
    reset() {
        this.isPlayed = false;
        listPlayer.forEach((player) => {
            player.reset();
        })
    }
    this.comparePoint = (master, player) => {
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
}