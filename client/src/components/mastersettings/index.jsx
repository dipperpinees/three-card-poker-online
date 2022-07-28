import React, { useEffect, useRef, useState } from 'react';
import { formatMoney } from '../../helper/money';
import "./styles.scss";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

function MasterSettings({socket, isMaster}) {
    const [maxCash, setMaxCash] = useState(5000);
    useEffect(() => {
        socket.on("maxcash", (args) => {
            setMaxCash(args);
        })
        socket.on("askmaster", ({name, socketId}) => {
            confirmAlert({
                title: 'Xin làm cái',
                message: `${name} muốn xin làm cái`,
                buttons: [
                  {
                    label: 'OK',
                    onClick: () => socket.emit("changemaster", socketId)
                  },
                  {
                    label: 'Hủy',
                  }
                ]
            });
        })
    }, [socket])

    return (
        <div className='master-settings'>
        <h5>Tối đa: {formatMoney(maxCash)}đ</h5>
        </div>
    );
}

export default MasterSettings;