import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import { SocketContext } from '../../context/socket';
import "./styles.scss";

interface Props {
    isMaster: boolean;
}

function CashInput({isMaster}: Props) {
    const [showInput, setShowInput] = useState(true);
    const socket = useContext<Socket>(SocketContext);

    useEffect(() => {
        socket.on("clear", () => {
            setShowInput(true);
        })
        socket.on("start", () => {
            setShowInput(false);
        })
    }, [socket])
    if(isMaster) return;
    return (
        <>
        {showInput && <div className='cashinput'>
            <div>
                <select name="cash" id="cash" onChange={e => socket.emit("send-cash", e.target.value)} >
                    <option value={1000}>Tiền</option>
                    {[...Array(10)].map((x, i) => (
                        <option key={i} value={(i+1)*1000}>{(i+1)*1000}đ</option>
                    ))}
                </select>
    
            </div>
            <button onClick={() => socket.emit("contribute")}>Góp gà</button>
            <button onClick={() => socket.emit("ask-master")}>Xin làm cái</button>
        </div>
        }
        </>
    );
}

export default CashInput;