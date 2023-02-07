import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../context/socket';

function Toastify() {
    const socket = useContext<Socket>(SocketContext);
    const [cashAudio] = useState(new Audio(require('../../assets/sound/cashsound.mp3')));
    useEffect(() => {
        socket.on("alert", ({type, message}: {type: string, message: string}) => {
            if(type === "win") {
                cashAudio.play();
            }
            toast(message);
        })
    }, [socket, cashAudio])
    return (
      <div>
        <ToastContainer 
            position="top-right"
            autoClose={4000}
        />
      </div>
    );
}

export default Toastify;