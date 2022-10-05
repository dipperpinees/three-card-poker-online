import React from 'react';
import "./styles.scss";

function SendCash({title, onClose, onSubmit}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e.target.cash.value);
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