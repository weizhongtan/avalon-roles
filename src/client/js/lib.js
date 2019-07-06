import uuid from 'uuid/v4';
import { serialise, deserialise } from '../../common';
import TYPES from '../../config';

function createSend(socket, type) {
  return (input = {}) => {
    const data = Object.assign({}, {
      type,
      payload: input
    });
    const ackId = uuid();
    return new Promise((resolve, reject) => {
      const ackListener = (event) => {
        if (event.data) {
          const { ackId: _ackId, payload } = deserialise(event.data);
          if (_ackId === ackId) {
            if (payload.err) {
              reject(payload.err);
            } else {
              socket.removeEventListener('message', ackListener);
              console.log('ack:', payload);
              resolve(payload);
            }
          }
        }
      };
      socket.addEventListener('message', ackListener);
      const dataToSend = Object.assign({}, data, {
        ackId,
      });
      console.log('sending:', dataToSend);
      socket.send(serialise(dataToSend));
    });
  };
}

// eslint-disable-next-line
export function createChannel() {
  const socket = new WebSocket(window.location.origin.replace('http', 'ws'));
  return {
    createRoom: createSend(socket, TYPES.CREATE_ROOM),
    joinRoom: createSend(socket, TYPES.JOIN_ROOM),
    startGame: createSend(socket, TYPES.START_GAME),
    onNotification(cb) {
      socket.addEventListener('message', (event) => {
        if (event.data) {
          const data = deserialise(event.data);
          // ignore acks
          if (data.ackId) {
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
