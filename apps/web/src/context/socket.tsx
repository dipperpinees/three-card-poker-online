import React, { createContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_ENDPOINT } from '../config';

export const SocketContext = createContext(null);
export default function SocketStore({ children }: { children: React.ReactNode }) {
    const socket = useRef(io(API_ENDPOINT));

    return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
}
