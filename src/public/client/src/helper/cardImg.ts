export const handleCardImage = (point: number, type: string) => {
    switch (type) {
        case 'DIAMOND': {
            return require('../assets/img/' + point + '_of_diamonds.webp');
        }
        case 'HEART': {
            return require('../assets/img/' + point + '_of_hearts.webp');
        }
        case 'CLUB': {
            return require('../assets/img/' + point + '_of_clubs.webp');
        }
        case 'SPADE': {
            return require('../assets/img/' + point + '_of_spades.webp');
        }
        default:
            return;
    }
};
