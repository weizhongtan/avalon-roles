import uuid from 'uuid/v4';
import { serialise } from '../../common';
import TYPES from '../../config';

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
    console.log(dataToSend);
    socket.send(serialise(dataToSend));
  });
}

export function createChannel(socket) {
  return {
    async createRoom(data) {
      return send(socket, {
        type: TYPES.CREATE_ROOM,
        payload: data,
      });
    },
    async joinRoom(data) {
      return send(socket, {
        type: TYPES.JOIN_ROOM,
        payload: data,
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
    async setPlayerName(playerName) {
      return send(socket, {
        type: TYPES.SET_PLAYER_DATA,
        payload: playerName,
      });
    },
  };
}
