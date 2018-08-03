import uuid from 'uuid/v4';
import { serialise, deserialise } from '../../common';
import TYPES from '../../config';

async function send(socket, data) {
  const ackID = uuid();
  return new Promise((resolve) => {
    const ackListener = (event) => {
      if (event.data) {
        const { ackID: _ackID, payload } = deserialise(event.data);
        if (_ackID === ackID) {
          socket.removeEventListener('message', ackListener);
          console.log('ack:', payload);
          resolve(payload);
        }
      }
    };
    socket.addEventListener('message', ackListener);
    const dataToSend = Object.assign({}, data, {
      ackID,
    });
    console.log('sending', dataToSend)
    socket.send(serialise(dataToSend));
  });
}

// eslint-disable-next-line
export function createChannel() {
  const socket = new WebSocket(window.location.origin.replace('http', 'ws'));
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
    async startGame(data) {
      return send(socket, {
        type: TYPES.START_GAME,
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
          const data = deserialise(event.data);
          if (data.ackID) {
            return;
          }
          cb(data);
        }
      });
    },
  };
}

export function getRandomIcon() {
  const icons = ['heart', 'bolt', 'eye', 'tint', 'bomb'];
  return icons[Math.floor(Math.random() * icons.length)];
}
