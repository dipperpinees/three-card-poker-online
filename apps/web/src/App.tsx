import React, { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from 'react-icons/md';
import { Socket } from 'socket.io-client';
import './App.scss';
import Board from './components/Board';
import CashInput from './components/CashInput';
import Contribute from './components/Contribute';
import Control from './components/Control';
import JoinForm from './components/JoinForm';
import MasterSettings from './components/MasterSettings';
import Toastify from './components/Notification';
import OpenCard from './components/OpenCards';
import { SocketContext } from './context/socket';

function App() {
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [pos, setPos] = useState<number>();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const socket = useContext<Socket>(SocketContext);
    const [isMaster, setIsMaster] = useState(false);
    const [isJoin, setIsJoin] = useState(false);

    const toggleFullSceen = () => {
        setIsFullscreen(!isFullscreen);
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            return;
        }
        if (document.exitFullscreen) document.exitFullscreen();
    };

    useEffect(() => {
        socket.on('join', (args: { isMaster: boolean }) => {
            setIsMaster(args.isMaster);
            setIsJoin(true);
        });
        socket.on('new-master', () => {
            setIsMaster(true);
        });
        socket.on('not-master', () => {
            setIsMaster(false);
        });
        socket.on('join-room', () => {
            setShowJoinForm(true);
        });
    }, [socket]);

    const connectSocket = async (name: string, avatar: string) => {
        setShowJoinForm(false);
        socket.emit('join', {
            name: name,
            pos: pos,
            cash: Number(localStorage.getItem('cash2')),
            avatar: avatar,
        });
    };
    const openJoinForm = (pos: number) => {
        setPos(pos);
        socket.emit('change-pos', { pos: pos });
    };

    return (
        <div className="App">
            <div className="background"></div>
            <Board onShowJoinForm={openJoinForm} />
            <OpenCard />
            {!isMaster && isJoin && <CashInput isMaster={false} />}
            {isMaster && <Control />}
            <MasterSettings isMaster={isMaster} />
            <Toastify />
            {isMobile && (
                <div onClick={() => toggleFullSceen()} className="fullscreen">
                    {isFullscreen ? <MdOutlineFullscreenExit /> : <MdOutlineFullscreen />}
                </div>
            )}
            {showJoinForm && (
                <JoinForm onConnect={connectSocket} onClose={() => setShowJoinForm(false)} />
            )}
            <Contribute />
        </div>
    );
}

export default App;
