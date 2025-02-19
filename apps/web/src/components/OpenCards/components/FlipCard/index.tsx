import React, { MouseEventHandler, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { handleCardImage } from '../../../../helper/cardImg';
import { ICard } from '../../../Cards';
import './styles.scss';

interface Props {
    card: ICard;
    onFlip: () => void;
}

function FlipCard({ card, onFlip }: Props) {
    const [isFlip, setIsFlip] = useState(false);
    const handleFlip: MouseEventHandler<HTMLImageElement> = (e) => {
        e.preventDefault();
        setIsFlip(true);
        onFlip();
    };

    return (
        <ReactCardFlip isFlipped={isFlip} flipDirection="horizontal">
            <div>
                <img
                    onClick={handleFlip}
                    src={require('../../../../assets/img/behind.webp')}
                    alt="card"
                />
            </div>
            <div>
                <img src={handleCardImage(card.point, card.suit)} alt="card" />
            </div>
        </ReactCardFlip>
    );
}

export default FlipCard;
