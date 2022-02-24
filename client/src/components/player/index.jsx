import React from 'react';
import { formatMoney } from '../../helper/money';
import Cards from '../cards';
import "./styles.scss";
import {isMobile} from 'react-device-detect';

function Player({player, isYou, onSend, onPut}) {
    const {isMaster, socketId, cash, isOpened, cards, cashSended, name, pos, avatar, cashOther} = player;
    if(isYou) {
        localStorage.setItem("cash2", cash);
    }
    const handlePosPc = (index) => {
        switch(index) {
            case 1: 
                return {top: 100, left: -80}
            case 2: 
                return {top: -36, left: 48}
            case 3: 
                return {top: -56, left: 240}
            case 4: 
                return {top: -56, right: 240}
            case 5:
                return {top: -36, right: 48}
            case 6: 
                return {top: 100, right: -80}
            case 7: 
                return {bottom: 100, right: -80}
            case 8: 
                return {bottom: -36, right: 48}
            case 9:
                return {bottom: -56, right: 240}
            case 10:
                return {bottom: -56, left: 240}
            case 11: 
                return {bottom: -36, left: 48}
            case 12: 
                return {bottom: 100, left: -80}
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
        let money = prompt("Số tiền muốn tặng cho " + name, 0);

        if (Number(money) >= 1000) {
            onSend(socketId, Number(money));
        }
    }

    const handlePut = () => {
        let money = prompt("Số tiền muốn đặt nhờ " + name, 0);

        if (Number(money) >= 1000) {
            onPut(socketId, Number(money));
        }
    }

    return (
        <div className='player' 
            style={{...handlePos(isMobile, pos), border: isYou ? "2px solid #F7C600" : "2px solid #9880E9", backgroundColor: isYou ? "#125413" : "#2E1F3E"}} 
        >
            <div className='player-header'>
                <div className='player-header-info'>
                    <div className='player-header-avatar'>
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div>
                        <p className='player-header-name'>{name}</p>
                        <p className='player-header-cash' onClick={!isYou && handleSend}>{formatMoney(cash)}đ</p>
                    </div>
                </div>
                {!isMaster && <p className='player-header-cash' onClick={!isYou && !isMaster && handlePut}>Đặt: {formatMoney(cashSended + cashOther)}đ</p>}
            </div>
            {isOpened && <Cards pos={handlePosCard(pos)} cards={cards}/>}
            {isMaster && <div className="player-master">👑</div>}
        </div>
    );
}

export default Player;