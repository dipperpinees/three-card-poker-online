import React, { useEffect, useState } from 'react';
import "./styles.scss";

function Modal({socket, onCancelMaster}) {
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false); 
    const [newMasterId, setNewMasterId] = useState(null)
    useEffect(() => {
        socket.on("askmaster", ({name, socketId}) => {
            setNewMasterId(socketId);
            setMessage(`${name} muốn xin làm cái. Đồng ý?`);
            setShowModal(true);
        })
    }, [socket])
    return (
        <>
        {showModal && <div className="modal">
            <div>
                <p>{message}</p>
                <div>
                    <button onClick={() => { socket.emit("changemaster", newMasterId); onCancelMaster(); setShowModal(false); }}>
                        OK
                    </button>
                    <button onClick={() => setShowModal(false)}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>}
        </>
    );
}

export default Modal;