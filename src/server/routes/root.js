const debug = require('debug')('avalon:app');

const TYPES = require('../../config');
const Player = require('../Player');
const RoomList = require('../RoomList');
const PlayerList = require('../PlayerList');
const createHandlers = require('../create-handlers');
const { deserialise } = require('../../common');

const roomList = new RoomList();
const playerList = new PlayerList();

const root = ctx => {
  debug('new client entered', ctx.session);

  // each player is identified by their session id
  let player = playerList.getPlayer(ctx.session.id);
  if (player) {
    player.setActive(true);
    player.setSocket(ctx.websocket);
    roomList.rejoinPlayer(player);
  } else {
    player = new Player(ctx.websocket);
    playerList.addPlayer(ctx.session.id, player);
  }

  const handlers = createHandlers({ roomList, player });

  ctx.websocket.on('message', (data) => {
    const { type, payload, ackID } = deserialise(data);
    if (!ackID) {
      debug('got message with no ackID, ignoring');
      return;
    }
    const handler = handlers[type];
    if (typeof handler === 'function') {
      const ack = (message) => {
        player.send({
          ackID,
          type: TYPES.ACK,
          payload: message,
        }, (err) => {
          if (err) {
            debug('Socket connection failed, removing player from all rooms');
            roomList.removePlayer(player);
          }
        });
      };
      handler(ack, payload);
    } else {
      debug(`couldn't match handler type ${type}`);
    }
  });

  ctx.websocket.on('close', () => {
    debug('player disconnected, removing socket channel');
    player.setActive(false);
    player.setSocket(null);
    const room = roomList.getRoomByPlayer(player);
    if (room) {
      room.updateClients();
    }
  });
};

module.exports = root;
