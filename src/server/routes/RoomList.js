const debug = require('debug')('avalon:RoomList');

class RoomList {
  constructor() {
    this._rooms = new Set();
  }

  addRoom(room) {
    this._rooms.add(room);
  }

  getRoomById(id) {
    return Array.from(this._rooms).find(room => room.getId() === id);
  }

  getRoomByPlayer(player) {
    return Array.from(this._rooms).find(room => room.has(player));
  }

  removePlayerFromRooms(player) {
    this._rooms.forEach(room => {
      const wasRemoved = room.remove(player);
      if (wasRemoved) {
        debug('player was removed from', room.getId());
      }
    });
  }

  notifyRoomWithPlayer(player) {
    this._rooms.forEach(room => {
      if (room.has(player)) {
        room.notify();
        debug('player rejoined room with id: ', room.getId());
      }
    });
  }
}

module.exports = RoomList;
