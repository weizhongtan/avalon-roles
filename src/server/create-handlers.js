const Room = require('./Room');
const TYPES = require('../config');

module.exports = ({ roomList, player }) => {
  const handlers = {
    [TYPES.CREATE_ROOM]: (ack, { roomID, selectedCharacterIDs }) => {
      if (roomList.get(roomID)) {
        ack({ err: `room ${roomID} already exists` });
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
    [TYPES.START_GAME]: (ack, { roomID }) => {
      if (!roomID) {
        ack({ err: 'roomID not provided' });
        return;
      }
      if (!roomList.get(roomID)) {
        ack({ err: `roomID ${roomID} does not exist` });
        return;
      }
      const room = roomList.get(roomID);
      const res = room.tryStartGame();
      if (!res) {
        ack({ err: 'game could not start' });
      }
    },
  };

  return handlers;
};
