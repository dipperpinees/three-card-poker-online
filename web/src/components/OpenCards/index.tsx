import React, { useContext, useEffect, useState } from 'react';
import './styles.scss';
import FlipCard from './components/FlipCard';
import { Socket } from 'socket.io-client';
import { ICards } from '../Cards';
import { SocketContext } from '../../context/socket';

function OpenCard() {
    const [cards, setCards] = useState<ICards>(null);
    const [countOpened, setCountOpened] = useState(0);
    const [openAudio] = useState(new Audio(require('../../assets/sound/opensound.wav')));
    const [winAudio] = useState(new Audio(require('../../assets/sound/winsound.wav')));
    const [dealAudio] = useState(new Audio(require('../../assets/sound/dealsound.wav')));
    const socket = useContext<Socket>(SocketContext);

    useEffect(() => {
        socket.on('deal-card', (args) => {
            dealAudio.play();
            setCards(args);
        });
        socket.on('clear', () => {
            setCards(null);
        });
        return () => {
            socket.off('deal-card');
        };
    }, [socket, dealAudio]);

    const handleCountOpened = () => {
        openAudio.play();
        setCountOpened(countOpened + 1);
        if (countOpened === 2) {
            if (cards.point1 === 11 || cards.point1 === 10) {
                winAudio.play();
            }
            socket.emit('open-card');
            setCountOpened(0);
        }
    };
    return (
        <>
            {cards && (
                <div className="opencards">
                    {cards?.cards?.map((card, index) => (
                        <FlipCard onFlip={handleCountOpened} key={index} card={card} />
                    ))}
                </div>
            )}
        </>
    );
}

export default OpenCard;
