import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../context/socket';
import { DEFAULT_AVATAR } from '../../helper/constant';
import "./styles.scss";

function Contribute() {
    const [listPlayer, setListPlayer] = useState([]);
    const [winPlayer, setWinPlayer] = useState(null);
    const [cash, setCash] = useState(1000);
    const socket = useContext<Socket>(SocketContext);

    useEffect(() => {
        socket.on('contribute', ({players, winPlayer, cash}) => {
            setListPlayer(players);
            setWinPlayer(winPlayer);
            setCash(cash);
        })
    }, [socket])
    return (
        <div className="contribute">
            {!winPlayer && <p>🤲 Góp {listPlayer.length * cash}đ</p>}
            <div>
                {!winPlayer ? listPlayer.map((player) => (
                    <div className="tooltip">
                        <div className="contribute-avatar">
                            <img src={player.avatar || DEFAULT_AVATAR} alt="player"/>
                        </div> 
                    <span className="tooltiptext">{player.name}</span>
                    </div>
                )) : <p>Nhận tiền: {winPlayer.name}</p>}
                
            </div>
        </div>
    );
}

export default Contribute;