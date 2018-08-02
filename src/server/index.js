const Koa = require('koa');
const serve = require('koa-static');
const session = require('koa-session');
const _ = require('koa-route');
const websockify = require('koa-websocket');
const debug = require('debug');
const uuid = require('uuid');

const TYPES = require('../config');
const Player = require('./Player');
const createHandlers = require('./create-handlers');
const { deserialise } = require('../common');

global.log = debug('avalon');
const PORT = process.env.PORT || 8000;

const app = websockify(new Koa());

app.use(serve('./dist', {
  defer: true,
}));

app.keys = [`avalon-secret-${uuid()}`];

const CONFIG = {
  rolling: true,
};

app.use(session(CONFIG, app));

app.use(ctx => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;
  if (!ctx.session.id) {
    ctx.session.id = uuid();
  }
});

const removePlayerFromAllRooms = (player, roomList) => {
  roomList.forEach((room, roomID) => {
    const wasRemoved = room.remove(player);
    if (wasRemoved) {
      log('player was removed from', roomID);
    }
  });
};

const roomList = new Map();
const playerList = new Map();

app.ws.use(_.get('/', (ctx) => {
  log('new client entered', ctx.session);

  let player;
  if (playerList.has(ctx.session.id)) {
    player = playerList.get(ctx.session.id);
    player.setSocket(ctx.websocket);
    roomList.forEach((room) => {
      if (room.has(player)) {
        player.setActive(true);
        room.updateClients();
      }
    });
  } else {
    player = new Player(ctx.websocket);
    playerList.set(ctx.session.id, player);
  }

  const handlers = createHandlers({ roomList, player });

  ctx.websocket.on('message', (data) => {
    const { type, payload, ackID } = deserialise(data);
    if (!ackID) {
      log('got message with no ackID, doing nothing');
      return;
    }
    const handler = handlers[type];
    if (typeof handler === 'function') {
      const ack = (message) => {
        log('acking:', {
          ackID,
          message,
        });
        player.send({
          ackID,
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
  });

  ctx.websocket.on('close', () => {
    log('player disconnected, setting to inactive');
    player.setActive(false);
  });
}));

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  log(`listening on *:${PORT}`);
});
