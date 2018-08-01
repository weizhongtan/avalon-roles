const WebSocket = require('ws');
const Koa = require('koa');
const debug = require('debug');
const http = require('http');
const serve = require('koa-static');
const session = require('koa-session');
const uuid = require('uuid');

const TYPES = require('../config');
const Player = require('./Player');
const createHandlers = require('./create-handlers');

global.log = debug('avalon');
const PORT = process.env.PORT || 8000;

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

app.use(serve('./dist', {
  defer: true,
}));

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
};

app.use(session(CONFIG, app));

app.use(ctx => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;
  if (!ctx.session.id) {
    ctx.session.id = uuid();
  }
  console.log(ctx.session);
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

wss.on('connection', (ws) => {
  log('client connected');

  const player = new Player(ws);
  const handlers = createHandlers({ roomList, player });

  ws.on('message', (json) => {
    const { type, payload, ackID } = JSON.parse(json);
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

  ws.on('close', () => {
    log('player left, removing from all rooms');
    removePlayerFromAllRooms(player, roomList);
  });
});

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  log(`listening on *:${PORT}`);
});
