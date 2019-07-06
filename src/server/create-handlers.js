const debug = require('debug')('avalon:create-handlers');

const Room = require('./Room');
const TYPES = require('../config');

module.exports = ({ roomList, player }) => {
  const handlers = {
    [TYPES.CREATE_ROOM]: (ack, { selectedCharacterIDs }) => {
      debug('creating room');
      const room = new Room(selectedCharacterIDs);
      roomList.addRoom(room);
      ack({ roomId: room.getId(), selectedCharacterIDs });
    },
    [TYPES.JOIN_ROOM]: (ack, { roomId, playerName }) => {
      player.setName(playerName);
      const room = roomList.getRoomById(roomId);
      if (room) {
        // remove player from other rooms
        roomList.removePlayer(player);
        room.add(player);
        ack({
          playerName,
          roomId
        });
      } else {
        ack({
          err: `room with id ${roomId} does not exist`
        });
      }
    },
    [TYPES.START_GAME]: (ack, { roomId }) => {
      if (!roomId) {
        ack({ err: 'roomId not provided' });
        return;
      }
      if (!roomList.get(roomId)) {
        ack({ err: `roomId ${roomId} does not exist` });
        return;
      }
      const room = roomList.get(roomId);
      const res = room.tryStartGame();
      if (!res) {
        ack({ err: 'game could not start' });
      }
    },
  };

  return handlers;
};
