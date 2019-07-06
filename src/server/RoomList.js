const debug = require('debug')('avalon:RoomList');

class RoomList {
  constructor() {
    this.rooms = new Map();
  }

  addRoom(room) {
    this.rooms.set(room.getId(), room);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
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
        player.setActive(true);
        room.updateClients();
        debug('player rejoined room with id: ', roomId);
      }
    });
  }
}

module.exports = RoomList;
