import React, { useEffect, useState } from 'react';
import "./styles.scss";

function Contribute({socket}) {
    const [listPlayer, setListPlayer] = useState([]);
    const [winPlayer, setWinPlayer] = useState(null);
    const [cash, setCash] = useState(1000);
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
                            <img src={player.avatar} alt="player"/>
                        </div> 
                    <span className="tooltiptext">{player.name}</span>
                    </div>
                )) : <p>Nhận tiền: {winPlayer.name}</p>}
                
            </div>
        </div>
    );
}

export default Contribute;