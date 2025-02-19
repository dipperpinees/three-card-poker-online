import React, { useContext, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../context/socket';
import { formatMoney } from '../../helper/format-cash';
import './styles.scss';

interface Props {
    isMaster: boolean;
}

function MasterSettings({ isMaster }: Props) {
    const socket = useContext<Socket>(SocketContext);
    const [maxCash, setMaxCash] = useState(5000);
    useEffect(() => {
        socket.on('max-cash', (args: number) => {
            setMaxCash(args);
        });
        socket.on('ask-master', ({ name, socketId }: { name: string; socketId: string }) => {
            confirmAlert({
                title: 'Apply to be dealer',
                message: `${name} wants to apply to become dealer`,
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => socket.emit('change-master', socketId),
                    },
                    {
                        label: 'Cancel',
                        onClick: () => {},
                    },
                ],
            });
        });
    }, [socket]);

    return (
        <div className="master-settings">
            <h5>Maximum: {formatMoney(maxCash)}đ</h5>
        </div>
    );
}

export default MasterSettings;
