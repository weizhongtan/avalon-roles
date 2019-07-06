import uuid from 'uuid/v4';
import { serialise, deserialise, types } from '../../common';

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
          const { type: _type, ackId: _ackId, payload } = deserialise(event.data);
          if (_ackId === ackId) {
            if (payload.err) {
              console.log('got error', payload.err);
              reject(payload.err);
            } else {
              socket.removeEventListener('message', ackListener);
              console.log(_type, payload);
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
    createRoom: createSend(socket, types.CREATE_ROOM),
    joinRoom: createSend(socket, types.JOIN_ROOM),
    startGame: createSend(socket, types.START_GAME),
    onNotification(cb) {
      socket.addEventListener('message', (event) => {
        if (event.data) {
          const { type, payload } = deserialise(event.data);
          if (type === types.NOTIFY_CLIENT) {
            console.log(type, payload);
            cb(payload);
          }
        }
      });
    },
  };
}

export function getRandomIcon() {
  const icons = ['heart', 'bolt', 'eye', 'tint', 'bomb'];
  return icons[Math.floor(Math.random() * icons.length)];
}
