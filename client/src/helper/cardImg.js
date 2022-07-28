export const handleCardImage = (point, type) => {
    switch(type) {
        case "ro": {
            return require("../assets/img/" + point + "_of_diamonds.webp");
        }
        case "co": {
            return require("../assets/img/" + point + "_of_hearts.webp");
        }
        case "tep": {
            return require("../assets/img/" + point + "_of_clubs.webp");
        }
        case "bich": {
            return require("../assets/img/" + point + "_of_spades.webp");
        }
        default: 
    }
}