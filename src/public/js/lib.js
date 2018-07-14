import uuid from 'uuid/v4';
import { serialise } from '../../lib';
import TYPES from '../../config';

export const DOM = {
    joinRoom: {
        input: document.querySelector('#join-room input'),
        button: document.querySelector('#join-room button'),
    },
    createRoom: {
        input: document.querySelector('#create-room input'),
        button: document.querySelector('#create-room button'),
    },
    info: {
        currentRoom: document.querySelector('#info .current-room'),
        currentMembers: document.querySelector('#info .current-members'),
    },
};

async function send(socket, data) {
    const ackId = uuid();
    return new Promise((resolve) => {
        const ackListener = (event) => {
            if (event.data) {
                const ackData = JSON.parse(event.data);
                if (ackData.ackId === ackId) {
                    socket.removeEventListener('message', ackListener);
                    console.log('ack:', ackData.payload);
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

export function createChannel(socket) {
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
        async onOpen(cb) {
            socket.addEventListener('open', cb);
        },
        async onMessage(cb) {
            socket.addEventListener('message', (event) => {
                // ignore acks
                if (event.data) {
                    const data = JSON.parse(event.data);
                    if (data.ackId) {
                        return;
                    }
                    cb(data);
                }
            });
        },
    };
}
