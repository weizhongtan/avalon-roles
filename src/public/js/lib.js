import { serialise } from '../../lib';
import TYPES from '../../config';

let ackIdCount = 0;

async function send(socket, data) {
    const ackId = ackIdCount;
    ackIdCount += 1;
    return new Promise((resolve) => {
        const ackListener = (event) => {
            if (event.data) {
                const ackData = JSON.parse(event.data);
                if (ackData.ackId === ackId) {
                    socket.removeEventListener('message', ackListener);
                    resolve(ackData);
                }
            }
        };
        socket.addEventListener('message', ackListener);
        const dataToSend = Object.assign({}, data, {
            ackId,
        });
        socket.send(serialise(dataToSend));
    });
}

function createAckChannel(socket) {
    return {
        async createRoom(roomName) {
            return send(socket, {
                type: TYPES.CREATE_ROOM,
                payload: roomName,
            });
        },
        async joinRoom(roomName) {
            return send(socket, {
                type: TYPES.JOIN_ROOM,
                payload: roomName,
            });
        },
    };
}

module.exports = {
    createAckChannel,
};
