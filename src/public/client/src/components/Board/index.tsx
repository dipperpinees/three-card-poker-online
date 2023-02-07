import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../context/socket';
import JoinBox from './components/JoinBox';
import Player from './components/Player';
import SendCash from './components/SendCash';
import "./styles.scss";

interface Props {
    onShowJoinForm: (index: number) => void;
}

function Board({onShowJoinForm}: Props) {
    const [listPlayer, setListPlayer] = useState([]);
    const [sendId, setSendId] = useState<string>("");
    const [message, setMessage] = useState<string>();
    const [showForm, setShowForm] = useState<boolean>();
    const [formType, setFormType] = useState<string>(); 
    const socket = useContext<Socket>(SocketContext);

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
    
    const handleConnect = (index: number) => {
        onShowJoinForm(index);
    }

    const handleShowForm = (recipientId: string, name: string, type: string) => {
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
    }

    const handleSendCash = (recipientCash: number) => {
        socket.emit('send-other', {recipientId: sendId, recipientCash: Number(recipientCash)});
    }

    const handlePutCash = (putCash: number) => {
        socket.emit('put-other', {putId: sendId, putCash: Number(putCash)});
    }

    return (
        <div className='board'>
            {[...Array(12)].map((x, i) => (
                <JoinBox key={i} index={i+1} onConnect={handleConnect}/>
            ))}
            {listPlayer.map((player, index) => (
                <Player isYou={socket.id === player.socketId} key={index} player={player} onShowForm={handleShowForm}/>
            ))}
            <img className="board-icon" src={require("../../assets/img/cards.png")} alt="icon" />
            {showForm && <SendCash onClose={() => setShowForm(false)} onSubmit={formType === 'send' ? handleSendCash : handlePutCash} title={message}/>}
        </div>
    );
}

export default Board;