const debug = require('debug')('avalon:create-handlers');

const Room = require('./Room');
const { errors, types } = require('../common');

module.exports = ({ roomList, player }) => {
  const handlers = {
    [types.CREATE_ROOM]: ({ selectedCharacterIds }) => {
      debug('creating room');
      const room = new Room(selectedCharacterIds);
      roomList.addRoom(room);
      return { roomId: room.getId(), selectedCharacterIds };
    },
    [types.JOIN_ROOM]: ({ roomId, playerName }) => {
      const room = roomList.getRoomById(roomId);
      if (room) {
        if (room.getPlayerByName(playerName)) {
          throw new Error(errors.DUPLICATE_NAME);
        }
        player.setName(playerName);
        // remove player from other rooms
        roomList.removePlayer(player);
        room.add(player);
        return { playerName, roomId };
      }
      throw new Error(`room with id ${roomId} does not exist`);
    },
    [types.START_GAME]: () => {
      const room = roomList.getRoomByPlayer(player);
      room.startGame();
    },
  };

  return handlers;
};
