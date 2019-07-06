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
        if (room.add(player)) {
          ack({
            playerName,
            roomId
          });
        } else {
          ack({
            err: `could not add to room ${roomId}`
          });
        }
      } else {
        ack({
          err: `room with id ${roomId} does not exist`
        });
      }
    },
    [TYPES.START_GAME]: (ack) => {
      const room = roomList.getRoomByPlayer(player);
      const res = room.tryStartGame();
      if (!res) {
        ack({ err: 'game could not start' });
      }
    },
  };

  return handlers;
};
