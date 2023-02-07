import React, { createContext, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);
export default function SocketStore({ children }: { children: React.ReactNode }) {
    const socket = useRef(
        io(process.env.ENV === 'production' ? '' : process.env.REACT_APP_API_ENDPOINT)
    );

    return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
}
