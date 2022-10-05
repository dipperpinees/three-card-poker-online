import React, { useEffect, useState } from 'react';
import "./styles.scss";

function CashInput({socket, isMaster}) {
    const [showInput, setShowInput] = useState(true);
   
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
                <select name="cash" id="cash" onChange={e => socket.emit("sendcash", e.target.value)} >
                    <option value={1000}>Tiền</option>
                    {[...Array(10)].map((x, i) => (
                        <option value={(i+1)*1000}>{(i+1)*1000}đ</option>
                    ))}
                </select>
    
            </div>
            <button onClick={() => socket.emit("contribute")}>Góp gà</button>
            <button onClick={() => socket.emit("askmaster")}>Xin làm cái</button>
        </div>
        }
        </>
    );
}

export default CashInput;