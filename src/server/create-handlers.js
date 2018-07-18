const Room = require('./Room');
const TYPES = require('../config');

module.exports = ({ roomList, player }) => {
  const handlers = {
    [TYPES.CREATE_ROOM]: (ack, { roomID, selectedCharacterIDs }) => {
      if (roomList.get(roomID)) {
        ack({ roomID: null });
        return;
      }
      const room = new Room(roomID, selectedCharacterIDs);
      roomList.set(roomID, room);
      ack({ roomID, selectedCharacterIDs });
    },
    [TYPES.JOIN_ROOM]: (ack, { roomID, playerName }) => {
      let wasAdded;
      player.setName(playerName);
      if (roomList.has(roomID)) {
        // remove player from other rooms
        roomList.forEach((room) => {
          room.remove(player);
        });
        const room = roomList.get(roomID);
        wasAdded = room.add(player);
      }
      ack({
        playerName,
        roomID: wasAdded ? roomID : null,
      });
    },
  };

  return handlers;
};
