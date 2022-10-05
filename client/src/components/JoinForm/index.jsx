import React, { useRef, useState } from 'react';
import './styles.scss';

function JoinForm({ onConnect, onClose }) {
    const nameRef = useRef();
    const avatarRef = useRef();
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));

    const handleSubmit = async () => {
        if (!nameRef.current.value) {
            alert('Tên để trống kìa bạn');
            return;
        }
        let avatar = localStorage.getItem('avatar');
        if (avatarRef.current.files[0]) {
            try {
                const formData = new FormData();
                formData.append('avatar', avatarRef.current.files[0]);
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/avatar`, {
                    method: 'post',
                    body: formData,
                });
                const responseJSON = await response.json();
                avatar = `${process.env.REACT_APP_API_ENDPOINT}/${responseJSON.avatar}`;
                localStorage.setItem('avatar', avatar)
            } catch (err) {
                alert(err.message);
                return;
            }
        }
        onConnect(nameRef.current.value, avatar);
    };

    const handleShowAvatar = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
            setAvatar(reader.result);
        }
    };

    return (
        <div className="joinform">
            <div className="overlay" onClick={() => onClose()}></div>
            <div className="joinform-content">
                <div>
                    <label htmlFor="name">Tên</label>
                    <input id="name" type="text" ref={nameRef} required />
                </div>
                <div>
                    <label htmlFor="avatar">Avatar</label>
                    <input
                        id="avatar"
                        type="file"
                        onChange={handleShowAvatar}
                        ref={avatarRef}
                        accept="image/*"
                        style={{ height: 40 }}
                    />
                </div>
                {avatar && (
                    <div className="joinform-content-avatar">
                        <img src={avatar} alt="avatar" />
                    </div>
                )}
                <button onClick={handleSubmit}>OK</button>
            </div>
        </div>
    );
}

export default JoinForm;
