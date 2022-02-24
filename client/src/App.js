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
import JoinForm from './components/joinform';

const socket = io("http://localhost:8021/");

function App(props) {
    // const [audio] = useState(new Audio(sound));
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [pos, setPos] = useState();
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
        })
        socket.on("newmaster", () => {
            setIsMaster(true);
        })
    }, [])

    const connectSocket = async (name, avatar) => {
        setShowJoinForm(false);
        socket.emit("join", {name: name, pos: pos, cash: Number(localStorage.getItem("cash2")), avatar: avatar})
        localStorage.setItem("name", name);
        localStorage.setItem("avatar", avatar);
    }   
    const openJoinForm = (pos) => {
        setPos(pos);
        if(!isJoin) {
            setShowJoinForm(true);
        } else {
            socket.emit("join", {pos: pos});
        }
    }

    const cancelMaster = () => {
        setIsMaster(false);
    }
    
    return (
        <div className='App'>
            <Board onShowJoinForm={openJoinForm} socket={socket}/>
            <OpenCard socket={socket}/>
            {!isMaster && isJoin && <CashInput socket={socket}/>}
            {isMaster && <Control socket={socket}/>}
            <MasterSettings socket={socket} isMaster={isMaster}/>
            <Modal socket={socket} onCancelMaster={cancelMaster}/>
            <Toastify socket={socket} />
            {isMobile && <img className="fullscreen" src="https://img.icons8.com/material-outlined/24/000000/full-screen--v1.png" onClick={() => toggleFullSceen()} alt="fullscreen"/>}
            {showJoinForm && <JoinForm onConnect={connectSocket} onClose={() => setShowJoinForm(false)}/>}
        </div>
    );
}

export default App;