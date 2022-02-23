import React, { useEffect, useState } from 'react';
import JoinBox from '../joinbox';
import Player from '../player';
import "./styles.scss";

function Board({onConnect, socket}) {
    const [listPlayer, setListPlayer] = useState([]);
    useEffect(() => {
        if(!socket) {
            return;
        }
        socket.on("update", (args) => {
            setListPlayer(args);
        })
        return () => {
            socket.off("update");
        }
    }, [socket])
    
    const handleConnect = (index) => {
        if(localStorage.getItem("name")) {
            onConnect(index, localStorage.getItem("name"));
            return;
        }
        let name = prompt("Nhập tên của bạn", "");
        if (name.length !== 0) {
            onConnect(index, name);
            localStorage.setItem("name", name);
        } else {
            alert("Tên trống")
        }
    }

    const handleSendMoney = (recipientId, recipientCash) => {
        socket.emit('sendother', {recipientId, recipientCash});
    }

    return (
        <div className='board'>
            {[...Array(12)].map((x, i) => (
                <JoinBox key={i} index={i+1} onConnect={handleConnect}/>
            ))}
            {listPlayer.map(({socketId, pos, name, cash, cashSended, isOpened, cards, isMaster}, index) => (
                <Player isYou={socket.id === socketId} key={index} index={pos} isMaster={isMaster} name={name} cash={cash} cashSended={cashSended} cards={cards} isOpened={isOpened} onSend={handleSendMoney} socketId={socketId}/>
            ))}
            <img src={require("../../assets/img/poker-chips.png")} alt="" />
        </div>
    );
}

export default Board;