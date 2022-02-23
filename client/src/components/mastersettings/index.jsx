import React, { useEffect, useRef, useState } from 'react';
import { formatMoney } from '../../helper/money';
import "./styles.scss";

function MasterSettings({socket, isMaster}) {
    const [showSettings, setShowSettings] = useState(true);
    const [maxCash, setMaxCash] = useState(5000);
    const inputRef = useRef();
    useEffect(() => {
        socket.on("clear", () => {
            setShowSettings(true);
        })
        socket.on("start", () => {
            setShowSettings(false);
        })
        socket.on("maxcash", (args) => {
            setMaxCash(args);
        })
    }, [socket])

    return (
        <div className='master-settings'>
        {showSettings && isMaster && <div className='master-settings-input'>
            <input type="number" placeholder='Số tiền đặt tối đa' ref={inputRef}/>
            <button onClick={() => socket.emit("maxcash", inputRef.current.value)}>Đặt</button>
        </div>}
        <h5>Số tiền đặt tối đa: {formatMoney(maxCash)}đ</h5>
        </div>
    );
}

export default MasterSettings;