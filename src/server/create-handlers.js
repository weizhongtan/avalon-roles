const debug = require('debug')('avalon:create-handlers');

const Room = require('./Room');
const { errors, types } = require('../common');

module.exports = ({ roomList, player }) => {
  const handlers = {
    [types.CREATE_ROOM]: (ack, { selectedCharacterIds }) => {
      debug('creating room');
      const room = new Room(selectedCharacterIds);
      roomList.addRoom(room);
      ack({ roomId: room.getId(), selectedCharacterIds });
    },
    [types.JOIN_ROOM]: (ack, { roomId, playerName }) => {
      const room = roomList.getRoomById(roomId);
      if (room) {
        if (room.getPlayerByName(playerName)) {
          return ack(new Error(errors.DUPLICATE_NAME));
        }
        player.setName(playerName);
        // remove player from other rooms
        roomList.removePlayer(player);
        try {
          room.add(player);
          ack({ playerName, roomId });
        } catch (err) {
          ack(err);
        }
      } else {
        ack(new Error(`room with id ${roomId} does not exist`));
      }
      return null;
    },
    [types.START_GAME]: (ack) => {
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
