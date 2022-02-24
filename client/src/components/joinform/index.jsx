import React, { useEffect, useRef } from 'react';
import "./styles.scss";

function JoinForm({onConnect, onClose}) {
    const nameRef = useRef();
    const avatarRef = useRef();
    useEffect(() => {
        if(localStorage.getItem("name")) {
            nameRef.current.value = localStorage.getItem("name");
        }

        if(localStorage.getItem("avatar")) {
            avatarRef.current.value = localStorage.getItem("avatar");
        }
    }, [])

    const handleSubmit = () => {
        onConnect(nameRef.current.value, avatarRef.current.value)
    }

    return (
        <div className="joinform">
            <div className="overlay" onClick={() => onClose()}></div>
            <div className="joinform-content">
                <input type="text" placeholder='Tên' ref={nameRef} required/>
                <input type="text" placeholder='Avatar' ref={avatarRef}/>
                <button onClick={handleSubmit}>OK</button>
            </div>
        </div>
    );
}

export default JoinForm;