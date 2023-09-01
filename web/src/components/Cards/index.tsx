import React from 'react';
import { handleCardImage } from '../../helper/cardImg';
import './styles.scss';
import { isMobile } from 'react-device-detect';

export enum SUIT {
    HEART = 'HEART',
    DIAMOND = 'DIAMOND',
    SPADE = 'SPADE',
    CLUB = 'CLUB',
}

export interface ICard {
    point: number;
    suit: SUIT;
}

export interface ICards {
    cards: ICard[];
    point1: number;
    point2: number;
}

interface Props {
    pos: string;
    cards: ICards;
    isMaster: boolean;
}

function Cards({ pos, cards, isMaster }: Props) {
    const handlePosPc = (pos: string) => {
        switch (pos) {
            case 'top': {
                return isMaster ? { top: -66 } : { top: -72 };
            }
            case 'bottom': {
                return isMaster ? { bottom: -70 } : { bottom: -80 };
            }
            case 'left': {
                return { left: -64, top: 12 };
            }
            case 'right': {
                return { right: -64, top: 12 };
            }
            default:
                return;
        }
    };

    const handlePosMobile = (pos: string) => {
        switch (pos) {
            case 'top': {
                return isMaster ? { top: -36 } : { top: -44 };
            }
            case 'bottom': {
                return isMaster ? { bottom: -46 } : { bottom: -50 };
            }
            case 'left': {
                return { left: -44, top: 12 };
            }
            case 'right': {
                return { right: -44, top: 12 };
            }
            default:
                return;
        }
    };

    return (
        <div className="cards" style={isMobile ? handlePosMobile(pos) : handlePosPc(pos)}>
            {cards?.cards?.map((card, index) => (
                <img key={index} src={handleCardImage(card.point, card.suit)} alt="card" />
            ))}
            {Number(cards.point1) === 11 && <span style={{ color: '#DC0024' }}>sáp</span>}
            {Number(cards.point1) === 10 && <span style={{ color: '#3A94D5' }}>10đ</span>}
            {Number(cards.point1) < 10 && <span style={{ color: '#000' }}>{cards.point1}đ</span>}
        </div>
    );
}

export default Cards;
