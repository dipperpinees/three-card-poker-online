import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../context/socket';
import './styles.scss';

function Control() {
    const [showControl, setShowControl] = useState<boolean | string>('start');
    const [count, setCount] = useState(5);
    const socket = useContext<Socket>(SocketContext);

    useEffect(() => {
        socket.on('new-turn', () => {
            setShowControl('new-turn');
        });
    }, [socket]);

    useEffect(() => {
        if (count > 0) {
            setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        }
    }, [count]);

    const handleNewGame = () => {
        socket.emit('reset');
        setShowControl('start');
        setCount(5);
    };

    const handleStart = () => {
        if (count > 0) {
            return;
        }
        socket.emit('start');
        setShowControl(false);
    };

    return (
        <div className="control">
            {showControl === 'start' && (
                <button onClick={handleStart}>Deal {count > 0 && `(${count})`}</button>
            )}
            {showControl === 'start' && (
                <button onClick={() => socket.emit('contribute')}>Contribute</button>
            )}
            {showControl === 'new-turn' && <button onClick={handleNewGame}>New game</button>}
        </div>
    );
}

export default Control;
