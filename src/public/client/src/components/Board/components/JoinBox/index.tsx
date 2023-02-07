import React from 'react';
import "./styles.scss";
import {isMobile} from 'react-device-detect';

interface Props {
    index: number;
    onConnect: (index: number) => void;
}

function JoinBox({index, onConnect}: Props) {
    const handlePosPc = (index: number) => {
        switch(index) {
            case 1: 
                return {top: 108, left: -80}
            case 2: 
                return {top: -36, left: 48}
            case 3: 
                return {top: -56, left: 260}
            case 4: 
                return {top: -56, right: 260}
            case 5:
                return {top: -36, right: 48}
            case 6: 
                return {top: 108, right: -80}
            case 7: 
                return {bottom: 108, right: -80}
            case 8: 
                return {bottom: -36, right: 48}
            case 9:
                return {bottom: -56, right: 260}
            case 10:
                return {bottom: -56, left: 260}
            case 11: 
                return {bottom: -36, left: 48}
            case 12: 
                return {bottom: 108, left: -80}
            default:
                return;
        }
    }
    const handlePosMobile = (index: number) => {
        switch(index) {
            case 1: 
                return {top: 42, left: -52}
            case 2: 
                return {top: -38, left: 24}
            case 3: 
                return {top: -44, left: 136}
            case 4: 
                return {top: -44, right: 136}
            case 5:
                return {top: -38, right: 24}
            case 6: 
                return {top: 42, right: -52}
            case 7: 
                return {bottom: 42, right: -52}
            case 8: 
                return {bottom: -38, right: 24}
            case 9:
                return {bottom: -44, right: 136}
            case 10:
                return {bottom: -44, left: 136}
            case 11: 
                return {bottom: -38, left: 24}
            case 12: 
                return {bottom: 42, left: -52}
            default:
                return;
        }
    }
    const handlePos = (isMobile: boolean, pos: number) => {
        if(isMobile) {
            return handlePosMobile(pos);
        } else {
            return handlePosPc(pos)
        }
    }
    return (
        <div className='joinbox' style={handlePos(isMobile, index)} >
            <div onClick={() => onConnect(index)}>+</div>
        </div>
    );
}

export default JoinBox;