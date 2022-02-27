import React, { useEffect, useState } from 'react';
import "./styles.scss";

function Control({socket}) {
    const [showControl, setShowControl] = useState("start");
    const [count, setCount] = useState(5);
    useEffect(() => {
        socket.on("newturn", () => {
            setShowControl("newturn");
        })
    }, [socket])
    
    useEffect(() => {
        if(count > 0) {
            setTimeout(() => {
                setCount(count - 1);
            }, 1000)
        }
    }, [count])

    const handleNewGame = () => {
        socket.emit("reset"); 
        setShowControl("start");
        setCount(5);
    }

    const handleStart = () => {
        if(count > 0) {
            return;
        }
        socket.emit("start"); 
        setShowControl(false);
    }

    return (
        <div className="control">
            {showControl === "start" && <button onClick={handleStart}>Chia bài {count > 0 && `(${count})`}</button>}
            {showControl === "newturn" && <button onClick={handleNewGame}>Ván mới </button>}
        </div>
    );
}

export default Control;