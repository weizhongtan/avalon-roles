const WebSocket = require('ws');
const Koa = require('koa');
const debug = require('debug');
const http = require('http');
const serve = require('koa-static');

const TYPES = require('../config');
const Player = require('./Player');
const createHandlers = require('./create-handlers');

global.log = debug('avalon');
const PORT = process.env.PORT || 8000;

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

app.use(serve('./dist'));

const removePlayerFromAllRooms = (player, roomList) => {
  roomList.forEach((room, roomID) => {
    const wasRemoved = room.remove(player);
    if (wasRemoved) {
      log('player was removed from', roomID);
    }
  });
};

const roomList = new Map();

wss.on('connection', (ws) => {
  log('client connected');

  const player = new Player(ws);
  const handlers = createHandlers({ roomList, player });

  ws.on('message', (json) => {
    const { type, payload, ackId } = JSON.parse(json);
    const handler = handlers[type];
    if (typeof handler === 'function') {
      const ack = (message) => {
        player.send({
          ackId,
          type: TYPES.ACK,
          payload: message,
        }, (err) => {
          if (err) {
            log('Socket connection failed, removing player from all rooms');
            removePlayerFromAllRooms(player, roomList);
          }
        });
      };
      handler(ack, payload);
    }
    log('roomList:', roomList);
  });

  ws.on('close', () => {
    removePlayerFromAllRooms(player, roomList);
    log('roomList after close:', roomList);
  });
});

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  log(`listening on *:${PORT}`);
});
