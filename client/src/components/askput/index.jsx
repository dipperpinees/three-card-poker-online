import React, { useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

function AskPut({socket}) {
    useEffect(() => {
        socket.on("askput", ({putName, putId, putCash}) => {
            confirmAlert({
                title: 'Đặt nhờ',
                message: `${putName} muốn đặt nhờ ${putCash}`,
                buttons: [
                  {
                    label: 'OK',
                    onClick: () => socket.emit("putother", {putId, putCash})
                  },
                  {
                    label: 'Hủy',
                  }
                ]
            });
        })
    }, [])
    return (
        <div>
        </div>
    );
}

export default AskPut;