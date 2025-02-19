import { Cards } from './card';

interface PutOther {
    putCash: number;
    putId: string;
}

export default class Player {
    name: string;
    pos: number;
    isMaster: boolean;
    cash: number;
    avatar: string;
    socketId: string;
    cashSended: number;
    isOpened: boolean;
    cards: Cards;
    cashOther: number;
    putOther: PutOther[];
    earn: null | number;
    contribute: boolean;

    constructor(
        name: string,
        pos: number,
        cash: number,
        avatar: string,
        socketId: string,
        isMaster: boolean = false
    ) {
        this.name = name;
        this.pos = pos;
        this.isMaster = isMaster;
        this.cash = cash;
        this.avatar = avatar;
        this.socketId = socketId;
        this.cashSended = 1000;
        this.isOpened = false;
        this.cards = new Cards();
        this.cashOther = 0;
        this.putOther = [];
        this.earn = null;
        this.contribute = false;
    }
    earnCash(cash: number) {
        this.cash += cash;
        this.earn = cash;
    }
    reset() {
        this.cards = new Cards();
        this.isOpened = false;
        this.cashOther = 0;
        this.putOther = [];
        this.earn = null;
        this.contribute = false;
    }
    changePos(pos: number) {
        this.pos = pos;
    }
    openCard() {
        this.isOpened = true;
    }
}
