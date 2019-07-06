const debug = require('debug')('avalon:RoomList');

class RoomList {
  constructor() {
    this.rooms = new Map();
  }

  addRoom(room) {
    this.rooms.set(room.getId(), room);
  }

  getRoomById(roomId) {
    return this.rooms.get(roomId);
  }

  getRoomByPlayer(player) {
    let retRoom;
    this.rooms.forEach(room => {
      if (room.has(player)) {
        retRoom = room;
      }
    });
    return retRoom;
  }

  removePlayer(player) {
    this.rooms.forEach((room, roomId) => {
      const wasRemoved = room.remove(player);
      if (wasRemoved) {
        debug('player was removed from', roomId);
      }
    });
  }

  rejoinPlayer(player) {
    this.rooms.forEach((room, roomId) => {
      if (room.has(player)) {
        room.notifyClients();
        debug('player rejoined room with id: ', roomId);
      }
    });
  }
}

module.exports = RoomList;
