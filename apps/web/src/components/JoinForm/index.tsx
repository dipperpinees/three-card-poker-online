import React, { FormEvent, useRef, useState } from 'react';
import { FcAddImage } from 'react-icons/fc';
import { API_ENDPOINT } from '../../config';
import { DEFAULT_AVATAR } from '../../helper/constant';
import './styles.scss';

interface Props {
    onConnect: (name: string, avatar: string) => void;
    onClose: () => void;
}

interface FormData {
    name: {
        value: string;
    };
    avatar: {
        files: FileList;
    };
}

function JoinForm({ onConnect, onClose }: Props) {
    const avatarRef = useRef<HTMLInputElement>();
    const [avatar, setAvatar] = useState<string>(localStorage.getItem('avatar'));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { name, avatar } = e.target as typeof e.target & FormData;
        if (avatar.files[0]) {
            const formData = new FormData();
            formData.append('avatar', avatar.files[0]);
            const response = await fetch(`${API_ENDPOINT}/avatar`, {
                method: 'post',
                body: formData,
            });
            const responseJSON = await response.json();
            const avatarUrl = `${API_ENDPOINT}/${responseJSON.avatar}`;
            localStorage.setItem('avatar', avatarUrl);
            onConnect(name.value, avatarUrl);
            return;
        }
        onConnect(name.value, localStorage.getItem('avatar'));
    };

    const handleShowAvatar = (e: FormEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result?.toString());
        };
        if (file) {
            reader.readAsDataURL(file);
            setAvatar(reader.result?.toString());
        }
    };

    return (
        <div className="joinform">
            <div className="overlay" onClick={() => onClose()}></div>
            <form onSubmit={handleSubmit} className="joinform-content">
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" required />
                </div>
                <input
                    id="avatar"
                    type="file"
                    onChange={handleShowAvatar}
                    ref={avatarRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <div className="joinform-content-avatar" onClick={() => avatarRef.current.click()}>
                    <img src={avatar || DEFAULT_AVATAR} alt="avatar" />
                    <FcAddImage />
                </div>
                <button type="submit">OK</button>
            </form>
        </div>
    );
}

export default JoinForm;
