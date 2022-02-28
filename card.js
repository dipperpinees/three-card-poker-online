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
    for(let i = 1; i<=3; i++) {
        for(let j = 0; j<numPlayer; j++) {
            if(i === 1) {
                dealedCard[j] = {
                    point1: 0,
                    point2: 0,
                    cards: []
                }
            }
            const randomNumber = Math.floor(Math.random() * listCard.length);
            dealedCard[j].cards.push(listCard[randomNumber]);
            listCard.splice(randomNumber, 1);
            if(i === 3) {
                const {point1, point2} = calculatePoint(dealedCard[j].cards);
                dealedCard[j].point1 = point1;
                dealedCard[j].point2 = point2;
            }
        }
    }
    shuffleArray(dealedCard);
    return dealedCard;
} 

module.exports = {dealingCard};