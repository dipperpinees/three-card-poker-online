import React, { ReactNode } from 'react';
import SocketStore from './socket';

export default function Store({ children }: { children: ReactNode }) {
    return <SocketStore>
        {children}
    </SocketStore>
}
