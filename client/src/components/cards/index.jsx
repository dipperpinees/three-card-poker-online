import React from 'react';
import { handleCardImage } from '../../helper/cardImg';
import "./styles.scss";
import {isMobile} from 'react-device-detect';

function Cards({pos, cards}) {
    const handlePosPc = (pos) => {
        switch(pos) {
            case "top": {
                return {top: -56}
            }
            case "bottom": {
                return {bottom: -56}
            }
            case "left": {
                return {left: -124, top: 0}
            }
            case "right": {
                return {right: -124, top: 0}
            }
        }
    }

    const handlePosMobile = (pos) => {
        switch(pos) {
            case "top": {
                return {top: -32}
            }
            case "bottom": {
                return {bottom: -32}
            }
            case "left": {
                return {left: -72, top: 4}
            }
            case "right": {
                return {right: -72, top: 4}
            }
        }
    }

    return (
        <div className='cards' style={isMobile ? handlePosMobile(pos) : handlePosPc(pos)}>
            {cards?.cards?.map((card, index) => (
                <img key={index} src={handleCardImage(card.point, card.type)} alt="card" />
            ))}
            <span>{Number(cards.point1) === 11 ? "sáp" : `${cards.point1}đ`}</span>
        </div>
    );
}

export default Cards;