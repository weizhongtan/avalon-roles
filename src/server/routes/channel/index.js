const debug = require('debug')('avalon:app');
const uuidv4 = require('uuid/v4');

const Player = require('../Player');
const RoomList = require('../RoomList');
const PlayerList = require('../PlayerList');
const createHandlers = require('../create-handlers');
const features = require('../../features');
const { deserialise } = require('../../../common');

const roomList = new RoomList();
const playerList = new PlayerList();

// data should be serialisable, or an instance of Error
const createAck = (player, ackId) => data => {
  const payload = data instanceof Error ? { err: data.message } : data;
  player.ack(payload, ackId, (err) => {
    if (err) {
      debug('Socket connection failed, removing player from all rooms');
      roomList.removePlayerFromRooms(player);
    }
  });
};

const channel = ctx => {
  const sessionId = features.session ? ctx.session.id : uuidv4();
  // each player is identified by their session id
  let player = playerList.getPlayerById(sessionId);
  if (player) {
    debug('client re-entered', ctx.session);
    player.setSocket(ctx.websocket);
    roomList.notifyRoomWithPlayer(player);
  } else {
    debug('new client entered', ctx.session);
    player = new Player(ctx.websocket);
    playerList.addPlayer(sessionId, player);
  }

  const handlers = createHandlers({ roomList, player });

  ctx.websocket.on('message', (data) => {
    const { type, payload, ackId } = deserialise(data);
    if (!ackId) {
      debug('got message with no ackId, ignoring');
      return;
    }
    const handler = handlers[type];
    if (typeof handler === 'function') {
      const ack = createAck(player, ackId);
      try {
        ack(handler(payload));
      } catch (err) {
        debug(err);
        ack(err);
      }
    } else {
      debug(`couldn't match handler type ${type}`);
    }
  });

  ctx.websocket.on('close', () => {
    debug('client', sessionId, 'removing socket channel');
    player.setSocket(null);
    const room = roomList.getRoomByPlayer(player);
    if (room) {
      room.notify();
    }
  });
};

module.exports = channel;
