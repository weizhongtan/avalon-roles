const debug = require('debug')('avalon:create-handlers');

const Room = require('./Room');
const TYPES = require('../config');
const { errors } = require('../common');

module.exports = ({ roomList, player }) => {
  const handlers = {
    [TYPES.CREATE_ROOM]: (ack, { selectedCharacterIDs }) => {
      debug('creating room');
      const room = new Room(selectedCharacterIDs);
      roomList.addRoom(room);
      ack({ roomId: room.getId(), selectedCharacterIDs });
    },
    [TYPES.JOIN_ROOM]: (ack, { roomId, playerName }) => {
      const room = roomList.getRoomById(roomId);
      if (room) {
        if (room.getPlayerByName(playerName)) {
          return ack(new Error(errors.DUPLICATE_NAME));
        }
        player.setName(playerName);
        // remove player from other rooms
        roomList.removePlayer(player);
        if (room.add(player)) {
          ack({ playerName, roomId });
        } else {
          ack(new Error(`could not add to room ${roomId}`));
        }
      } else {
        ack(new Error(`room with id ${roomId} does not exist`));
      }
      return null;
    },
    [TYPES.START_GAME]: (ack) => {
      const room = roomList.getRoomByPlayer(player);
      try {
        room.startGame();
      } catch (err) {
        ack(err);
      }
    },
  };

  return handlers;
};
