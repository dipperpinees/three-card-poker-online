import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cashSound from '../../assets/sound/cashsound.mp3';

function Toastify({socket}) {
    const [cashAudio] = useState(new Audio(cashSound));
    useEffect(() => {
        socket.on("log", ({type, message}) => {
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