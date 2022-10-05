import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { io } from 'socket.io-client';
import "./App.scss";
import Board from './components/Board';
import CashInput from './components/CashInput';
import Contribute from './components/Contribute';
import Control from './components/Control';
import JoinForm from './components/JoinForm';
import MasterSettings from './components/MasterSettings';
import Toastify from './components/Notification';
import OpenCard from './components/OpenCards';

const socket = io(process.env.REACT_APP_API_ENDPOINT);

function App(props) {
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
        socket.on("notmaster", () => {
            setIsMaster(false);
        })
        socket.on("joinform", () => {
            setShowJoinForm(true);
        })
    }, [])

    const connectSocket = async (name, avatar) => {
        setShowJoinForm(false);
        socket.emit("join", {name: name, pos: pos, cash: Number(localStorage.getItem("cash2")), avatar: avatar})
    }   
    const openJoinForm = (pos) => {
        setPos(pos);
        socket.emit("changepos", {pos: pos});
    }
    
    return (
        <div className='App'>
            <div className='background'></div>
            <Board onShowJoinForm={openJoinForm} socket={socket}/>
            <OpenCard socket={socket}/>
            {!isMaster && isJoin && <CashInput socket={socket}/>}
            {isMaster && <Control socket={socket}/>}
            <MasterSettings socket={socket} isMaster={isMaster}/>
            <Toastify socket={socket} />
            {isMobile && <img className="fullscreen" src="https://img.icons8.com/material-outlined/24/000000/full-screen--v1.png" onClick={() => toggleFullSceen()} alt="fullscreen"/>}
            {showJoinForm && <JoinForm onConnect={connectSocket} onClose={() => setShowJoinForm(false)}/>}
            <Contribute socket={socket}/>
        </div>
    );
}

export default App;