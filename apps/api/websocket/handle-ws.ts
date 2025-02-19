import Game from '../lib/game';
import * as socketio from 'socket.io';
import { TypeWebSocket } from './type';

const handleWS = (game: Game) => {
    return (socket: socketio.Socket) => {
        socket.emit('update', game.listPlayer);
        socket.emit('contribute', game.contribute);

        socket.on('join', async ({ name, pos, cash, avatar }: TypeWebSocket.Join) => {
            game.addPlayer(socket, name, pos, cash, avatar);
        });

        socket.on('reset', () => {
            game.reset();
        });

        socket.on('ask-master', () => {
            game.pleaseMaster(socket);
        });

        socket.on('change-master', (args: string) => {
            game.changeMaster(socket, args);
        });

        socket.on('start', () => {
            game.start();
        });

        socket.on('send-cash', (args: number) => {
            game.sendCash(socket, args);
        });

        socket.on('put-other', ({ putId, putCash }: TypeWebSocket.PutOther) => {
            game.putOther(socket, putId, Number(putCash));
        });

        socket.on('open-card', () => {
            game.openCard(socket);
        });

        socket.on('disconnect', () => {
            game.disconnect(socket);
        });

        socket.on('change-pos', ({ pos }: TypeWebSocket.ChangePos) => {
            game.changePos(socket, pos);
        });

        socket.on('send-other', ({ recipientId, recipientCash }: TypeWebSocket.SendOther) => {
            game.sendOther(socket, recipientId, recipientCash);
        });

        socket.on('contribute', () => {
            game.contributeCash(socket);
        });
    };
};

export default handleWS;
