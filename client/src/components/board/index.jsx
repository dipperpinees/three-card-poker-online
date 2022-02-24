import React, { useEffect, useState } from 'react';
import JoinBox from '../joinbox';
import Player from '../player';
import "./styles.scss";

function Board({onShowJoinForm, socket}) {
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
        // if(localStorage.getItem("name")) {
        //     onConnect(index, localStorage.getItem("name"));
        //     return;
        // }
        // let name = prompt("Nhập tên của bạn", "");
        // if (name.length !== 0) {
        //     onConnect(index, name);
        //     localStorage.setItem("name", name);
        // } else {
        //     alert("Tên trống")
        // }
        onShowJoinForm(index);
    }

    const handleSendMoney = (recipientId, recipientCash) => {
        socket.emit('sendother', {recipientId, recipientCash});
    }

    const handlePutCash = (putId, putCash) => {
        socket.emit('putother', {putId, putCash});
    }

    return (
        <div className='board'>
            {[...Array(12)].map((x, i) => (
                <JoinBox key={i} index={i+1} onConnect={handleConnect}/>
            ))}
            {listPlayer.map((player, index) => (
                <Player isYou={socket.id === player.socketId} key={index} player={player} onSend={handleSendMoney} onPut={handlePutCash}/>
            ))}
            <img src={require("../../assets/img/poker-chips.png")} alt="icon" />
        </div>
    );
}

export default Board;