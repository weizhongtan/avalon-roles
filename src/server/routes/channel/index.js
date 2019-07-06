const uuidv4 = require('uuid/v4');

const Player = require('../Player');
const RoomList = require('../RoomList');
const PlayerList = require('../PlayerList');
const createHandlers = require('../create-handlers');
const features = require('../../features');
const { deserialise, log } = require('../../../common');

const roomList = new RoomList();
const playerList = new PlayerList();

// data should be serialisable, or an instance of Error
const createAck = (player, ackId) => data => {
  const payload = data instanceof Error ? { err: data.message } : data;
  player.ack(payload, ackId, (err) => {
    if (err) {
      log('Socket connection failed, removing player from all rooms');
      roomList.removePlayerFromRooms(player);
    }
  });
};

const channel = ctx => {
  const sessionId = features.session ? ctx.session.id : uuidv4();
  // each player is identified by their session id
  let player = playerList.getPlayerById(sessionId);
  if (player) {
    log('client re-entered', ctx.session);
    player.setSocket(ctx.websocket);
    roomList.notifyRoomWithPlayer(player);
  } else {
    log('new client entered', ctx.session);
    player = new Player(ctx.websocket);
    playerList.addPlayer(sessionId, player);
  }

  const handlers = createHandlers({ roomList, player });

  ctx.websocket.on('message', (data) => {
    const { type, payload, ackId } = deserialise(data);
    if (!ackId) {
      log('got message with no ackId, ignoring');
      return;
    }
    const handler = handlers[type];
    if (typeof handler === 'function') {
      const ack = createAck(player, ackId);
      try {
        ack(handler(payload));
      } catch (err) {
        log(err);
        ack(err);
      }
    } else {
      log(`couldn't match handler type ${type}`);
    }
  });

  ctx.websocket.on('close', () => {
    log('client', sessionId, 'removing socket channel');
    player.setSocket(null);
    const room = roomList.getRoomByPlayer(player);
    if (room) {
      room.notify();
    }
  });
};

module.exports = channel;
