import React, { useEffect, useState } from 'react';
import JoinBox from './components/joinbox';
import Player from './components/player';
import SendCash from './components/sendcash';
import "./styles.scss";

function Board({onShowJoinForm, socket}) {
    const [listPlayer, setListPlayer] = useState([]);
    const [sendId, setSendId] = useState();
    const [message, setMessage] = useState();
    const [showForm, setShowForm] = useState();
    const [formType, setFormType] = useState(); 

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

    const handleShowForm = (recipientId, name, type) => {
        if(type === 'send') {
            setSendId(recipientId);
            setMessage("Số tiền bạn muốn tặng cho " + name);
            setFormType("send");
            setShowForm(true);
        } else {
            setSendId(recipientId);
            setMessage("Số tiền bạn muốn đặt nhờ " + name);
            setFormType("put");
            setShowForm(true);
        }
        // socket.emit('sendother', {recipientId, recipientCash});
    }

    const handleSendCash = (recipientCash) => {
        socket.emit('sendother', {recipientId: sendId, recipientCash: Number(recipientCash)});
    }

    const handlePutCash = (putCash) => {
        socket.emit('askput', {putId: sendId, putCash: Number(putCash)});
    }

    return (
        <div className='board'>
            {[...Array(12)].map((x, i) => (
                <JoinBox key={i} index={i+1} onConnect={handleConnect}/>
            ))}
            {listPlayer.map((player, index) => (
                <Player isYou={socket.id === player.socketId} key={index} player={player} onShowForm={handleShowForm}/>
            ))}
            <img src={require("../../assets/img/poker-cards.png")} alt="icon" />
            {showForm && <SendCash onClose={() => setShowForm(false)} onSubmit={formType === 'send' ? handleSendCash : handlePutCash} title={message}/>}
        </div>
    );
}

export default Board;