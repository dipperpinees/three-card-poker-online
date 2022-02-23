import React, { useState } from 'react';
import "./styles.scss";
import ReactCardFlip from 'react-card-flip';
import { handleCardImage } from '../../helper/cardImg';

function FlipCard({card, onFlip}) {
    const [isFlip, setIsFlip] = useState(false);
    const handleFlip = (e) => {
        e.preventDefault();
        setIsFlip(true);
        onFlip();
    }

    return (
        <div>
            <ReactCardFlip isFlipped={isFlip} flipDirection="horizontal">
                <div>
                    <img onClick={handleFlip} src={require("../../assets/img/behind.png")} alt="card" />
                </div>

                <div>
                    <img src={handleCardImage(card.point, card.type)} alt="card" />
                </div>
            </ReactCardFlip>
        </div>
    );
}

export default FlipCard;