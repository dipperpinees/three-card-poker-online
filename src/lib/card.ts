enum SUIT {
    HEART = 'HEART',
    DIAMOND = 'DIAMOND',
    SPADE = 'SPADE',
    CLUB = 'CLUB',
}

class Card {
    point: number;
    suit: SUIT;
    constructor(point: number, suit: SUIT) {
        this.point = point;
        this.suit = suit;
    }
}

export class Cards {
    cards: Card[] = [];
    point1: number = 0;
    point2: number = 0;

    caculatePoint() {
        if (
            this.cards[0].point === this.cards[1].point &&
            this.cards[1].point === this.cards[2].point
        ) {
            this.point1 = 11;
            this.point2 = this.cards[1].point === 1 ? 10 : this.cards[1].point;
            return;
        }

        type MaxPoints = {
            [key in SUIT]: number;
        };
        const maxPoints: MaxPoints = {
            HEART: 0,
            DIAMOND: 0,
            CLUB: 0,
            SPADE: 0,
        };

        this.cards.forEach((card) => {
            this.point1 += card.point;
            if (card.point > maxPoints[card.suit]) {
                maxPoints[card.suit] = card.point;
            }
        });
        this.point2 =
            maxPoints[SUIT.DIAMOND] * 1000000 +
            maxPoints[SUIT.HEART] * 10000 +
            maxPoints[SUIT.CLUB] * 100 +
            maxPoints[SUIT.SPADE];
        this.point1 = this.point1 % 10 === 0 ? 10 : this.point1 % 10;
    }
}

const getDeckOfCards = (): Card[] => {
    const deckCards: Card[] = [];
    for (let i = 1; i < 10; i++) {
        Object.values(SUIT).forEach((suit) => deckCards.push(new Card(i, suit)));
    }
    return deckCards;
};

const shuffleArray = (array: Cards[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const dealingCard = (numPlayer: number): Cards[] => {
    const deckCards = getDeckOfCards();
    const dealedCard: Cards[] = [];

    for (let i = 0; i < numPlayer; i++) {
        dealedCard.push(new Cards());
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < numPlayer; j++) {
            const randomNumber = Math.floor(Math.random() * deckCards.length);
            dealedCard[j].cards.push(deckCards[randomNumber]);
            deckCards.splice(randomNumber, 1);
        }
    }

    for (let i = 0; i < numPlayer; i++) {
        dealedCard[i].caculatePoint();
    }

    shuffleArray(dealedCard);
    return dealedCard;
};

export default dealingCard;
