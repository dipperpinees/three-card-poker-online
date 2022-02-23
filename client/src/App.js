import React, { useEffect, useState } from 'react';
import "./App.css"
import Board from './components/board';
import CashInput from './components/cashinput';
import OpenCard from './components/opencards';
import { io } from 'socket.io-client';
import Control from './components/control';
import Modal from './components/modal';
import MasterSettings from './components/mastersettings';
import Toastify from './components/notification';
// import sound from './assets/sound/bgsound.mp3';
import {isMobile} from 'react-device-detect';

const socket = io("http://localhost:8021/");

function App(props) {
    // const [audio] = useState(new Audio(sound));
    const toggleFullSceen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
    };

    const [isMaster, setIsMaster] = useState(false);
    const [isJoin, setIsJoin] = useState(false);
    useEffect(() => {
        socket.on("join", (args) => {
            // audio.play();
            // audio.loop = true;
            // audio.volume = 0.2;
            if(args === "fail") {
                alert("Chưa thể tham gia phòng");
                return;
            }
            setIsMaster(args.isMaster);
            setIsJoin(true);
            localStorage.setItem("id", args.playerd);
        })
        socket.on("newmaster", () => {
            setIsMaster(true);
        })
    }, [])

    const connectSocket = async (index, name) => {
        socket.emit("join", {name: name, pos: index, cash: Number(localStorage.getItem("cash2"))})
    }

    const cancelMaster = () => {
        setIsMaster(false);
    }
    
    return (
        <div className='App'>
            <Board onConnect={connectSocket} socket={socket}/>
            <OpenCard socket={socket}/>
            {!isMaster && isJoin && <CashInput socket={socket}/>}
            {isMaster && <Control socket={socket}/>}
            <MasterSettings socket={socket} isMaster={isMaster}/>
            <Modal socket={socket} onCancelMaster={cancelMaster}/>
            <Toastify socket={socket} />
            {isMobile && <img className="fullscreen" src="https://img.icons8.com/material-outlined/24/000000/full-screen--v1.png" onClick={() => toggleFullSceen()} alt="fullscreen"/>}
        </div>
    );
}

export default App;