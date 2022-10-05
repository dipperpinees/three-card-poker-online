import React from 'react';
import { handleCardImage } from '../../helper/cardImg';
import "./styles.scss";
import {isMobile} from 'react-device-detect';

function Cards({pos, cards, isMaster}) {
    const handlePosPc = (pos) => {
        switch(pos) {
            case "top": {
                return isMaster ? {top: -66} : {top: -72}
            }
            case "bottom": {
                return isMaster ? {bottom: -70} : {bottom: -80}
            }
            case "left": {
                return {left: -64, top: 12}
            }
            case "right": {
                return {right: -64, top: 12}
            }
            default:
                return;
        }
    }

    const handlePosMobile = (pos) => {
        switch(pos) {
            case "top": {
                return isMaster ? {top: -36} : {top: -44}
            }
            case "bottom": {
                return isMaster ? {bottom: -46} : {bottom: -50}
            }
            case "left": {
                return {left: -44, top: 12}
            }
            case "right": {
                return {right: -44, top: 12}
            }
            default:
                return;
        }
    }

    return (
        <div className='cards' style={isMobile ? handlePosMobile(pos) : handlePosPc(pos)}>
            {cards?.cards?.map((card, index) => (
                <img key={index} src={handleCardImage(card.point, card.type)} alt="card" />
            ))}
            {Number(cards.point1) === 11 && <span style={{color: "#DC0024"}}>sáp</span >}
            {Number(cards.point1) === 10 && <span style={{color: "#3A94D5"}}>10đ</span>}
            {Number(cards.point1) < 10 && <span style={{color: "#000"}}>{cards.point1}đ</span>}
        </div>
    );
}

export default Cards;