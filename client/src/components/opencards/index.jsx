import React, { useEffect, useState } from 'react';
import "./styles.scss";
import FlipCard from '../flipcard';
import openSound from '../../assets/sound/opensound.wav';
import winSound from '../../assets/sound/winsound.wav';
import dealSound from '../../assets/sound/dealsound.wav';

function OpenCard({socket}) {
    const [cards, setCards] = useState(null);
    const [countOpened, setCountOpened] = useState(0);
    const [openAudio] = useState(new Audio(openSound));
    const [winAudio] = useState(new Audio(winSound));
    const [dealAudio] = useState(new Audio(dealSound));

    useEffect(() => {
        socket.on("dealcard", (args) => {
            dealAudio.play();
            setCards(args);
        })
        socket.on("clear", () => {
            setCards(null);
        })
        return () => {
            socket.off("dealcard")
        }
    }, [socket, dealAudio])

    const handleCountOpened = () => {
        openAudio.play();
        setCountOpened(countOpened + 1);
        if(countOpened === 2) {
            if(cards.point1 === 11 || cards.point1 === 10) {
                winAudio.play();
            }
            socket.emit("opencard");
            setCountOpened(0);
        }
    }
    return (
        <>
        {cards && <div className='opencards'>
            {cards?.cards?.map((card, index) => (
                <FlipCard onFlip={handleCountOpened} key={index} card={card}/>
            ))}
        </div>}
        </>
    );
}

export default OpenCard;