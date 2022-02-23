import React, { useEffect, useState } from 'react';
import "./styles.scss";

function Control({socket}) {
    const [showControl, setShowControl] = useState("start");
    useEffect(() => {
        socket.on("newturn", () => {
            setShowControl("newturn");
        })
    }, [socket])
    
    return (
        <div className="control">
            {showControl === "start" && <button onClick={() => {socket.emit("start"); setShowControl(false)}}>Chia bài</button>}
            {showControl === "newturn" && <button onClick={() => {socket.emit("reset"); setShowControl("start")}}>Ván mới</button>}
        </div>
    );
}

export default Control;