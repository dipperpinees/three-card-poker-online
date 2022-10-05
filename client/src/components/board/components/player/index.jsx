import React from 'react';
import { formatMoney } from '../../../../helper/money';
import Cards from '../../../Cards';
import "./styles.scss";
import {isMobile} from 'react-device-detect';

function Player({player, isYou, onShowForm}) {
    const {isMaster, socketId, cash, isOpened, cards, cashSended, name, pos, avatar, cashOther, earn} = player;
    if(isYou) {
        localStorage.setItem("cash2", cash);
    }
    const handlePosPc = (index) => {
        switch(index) {
            case 1: 
                return {top: 116, left: -80}
            case 2: 
                return {top: -36, left: 48}
            case 3: 
                return {top: -52, left: 260}
            case 4: 
                return {top: -52, right: 260}
            case 5:
                return {top: -36, right: 48}
            case 6: 
                return {top: 116, right: -80}
            case 7: 
                return {bottom: 116, right: -80}
            case 8: 
                return {bottom: -28, right: 48}
            case 9:
                return {bottom: -44, right: 260}
            case 10:
                return {bottom: -44, left: 260}
            case 11: 
                return {bottom: -28, left: 48}
            case 12: 
                return {bottom: 116, left: -80}
            default:
                return;
        }
    }
    const handlePosMobile = (index) => {
        switch(index) {
            case 1: 
                return {top: 42, left: -52}
            case 2: 
                return {top: -38, left: 24}
            case 3: 
                return {top: -44, left: 136}
            case 4: 
                return {top: -44, right: 136}
            case 5:
                return {top: -38, right: 24}
            case 6: 
                return {top: 42, right: -52}
            case 7: 
                return {bottom: 42, right: -52}
            case 8: 
                return {bottom: -38, right: 24}
            case 9:
                return {bottom: -44, right: 136}
            case 10:
                return {bottom: -44, left: 136}
            case 11: 
                return {bottom: -38, left: 24}
            case 12: 
                return {bottom: 42, left: -52}
            default:
                return;
        }
    }

    const handlePos = (isMobile, pos) => {
        if(isMobile) {
            return handlePosMobile(pos);
        } else {
            return handlePosPc(pos)
        }
    }

    const handlePosCard = (index) => {
        if(index === 1 || index === 12) {
            return "right";
        }

        if(index >=2 && index <=5) {
            return "bottom";
        }
        if(index >=6 && index <=7) {
            return "left";
        }
        if(index >=8 && index <=11) {
            return "top";
        }    
    }

    const handleSend = () => {
        onShowForm(socketId, name, "send");
    }

    const handlePut = () => {
        onShowForm(socketId, name, "put");
    }

    return (
        <div className={`player ${isMaster && "master"} ${isYou && "you"}`} style={{...handlePos(isMobile, pos)}}>
            <div className="player-cash" onClick={!isYou ? handleSend : undefined}>
                <p>💵 {formatMoney(cash)}đ</p>
            </div>

            <div className="player-info">
                <div className="player-info-avatar">
                    <img src={avatar} alt="avatar" />
                </div>
                <h5>{name}</h5>
                {isMaster && <div className="player-master">👑</div>}
                {earn !== null && <span className="player-earn">{earn >= 0 ? `+${earn}` : earn}</span>}
            </div>

            {!isMaster && <div className="player-put" onClick={!isYou && handlePut}>
                <p>
                    <img src="https://img.icons8.com/office/16/000000/chip.png" alt="game"/> 
                    {formatMoney(cashSended + cashOther)}đ
                </p>
            </div>}
            {isOpened && <Cards pos={handlePosCard(pos)} cards={cards} isMaster={isMaster}/>}
        </div>
    );
}

export default Player;