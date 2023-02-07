import React, { FormEvent } from 'react';
import "./styles.scss";

interface Props {
    title: string;
    onClose: () => void;
    onSubmit: (cash: number) => void
}

interface FormData {
    cash: {
        value: number;
    }
}

function SendCash({title, onClose, onSubmit}: Props) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const { cash } = e.target as typeof e.target & FormData;
        e.preventDefault();
        onSubmit(Number(cash.value));
        onClose();
    }
    return (
        <div className="sendcash">
            <form onSubmit={handleSubmit}>
                <p>{title}</p>
                <input type="number" list="cashlist" placeholder='Số tiền' name="cash" id="cash"/>
                <datalist id="cashlist">
                    {[...Array(6)].map((x, i) => (
                        <option value={(i+1)*1000} />
                    ))}
                </datalist>
                <div>
                    <button type="submit">OK</button>
                    <button type="submit" onClick={onClose}>Hủy</button>
                </div>
            </form>
        </div>
    );
}

export default SendCash;