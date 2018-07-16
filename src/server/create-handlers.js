const Room = require('./Room');
const TYPES = require('../config');

module.exports = ({ roomList, player }) => {
  const handlers = {
    [TYPES.CREATE_ROOM]: (ack, { roomID, selectedCharacterIDs }) => {
      if (roomList.get(roomID)) {
        ack(`room ${roomID} already exists`);
      } else {
        const room = new Room(roomID, selectedCharacterIDs);
        roomList.set(roomID, room);

        ack(`created room: ${roomID}`);
      }
    },
    [TYPES.JOIN_ROOM]: (ack, { roomID, playerName }) => {
      if (roomList.has(roomID)) {
        player.setName(playerName);

        // remove player from other rooms
        roomList.forEach((room) => {
          room.remove(player);
        });
        const room = roomList.get(roomID);
        room.add(player);

        ack(`joined room: ${roomID}`);
      } else {
        ack(`room: ${roomID} does not exist`);
      }
    },
  };

  return handlers;
};
