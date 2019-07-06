const debug = require('debug')('avalon:PlayerList');

class PlayerList {
  constructor() {
    this.players = new Map();
  }

  addPlayer(id, player) {
    this.players.set(id, player);
    debug('added player with id: ', id);
  }

  getPlayer(id) {
    if (this.players.has(id)) {
      debug('found player with id: ', id);
      return this.players.get(id);
    }
    return null;
  }
}

module.exports = PlayerList;
