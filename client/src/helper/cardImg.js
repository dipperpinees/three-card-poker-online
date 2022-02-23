export const handleCardImage = (point, type) => {
    switch(type) {
        case "ro": {
            return require("../assets/img/" + point + "_of_diamonds.png");
        }
        case "co": {
            return require("../assets/img/" + point + "_of_hearts.png");
        }
        case "tep": {
            return require("../assets/img/" + point + "_of_clubs.png");
        }
        case "bich": {
            return require("../assets/img/" + point + "_of_spades.png");
        }
    }
}