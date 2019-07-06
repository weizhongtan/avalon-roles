const debug = require('debug')('avalon:PlayerList');

class PlayerList {
  constructor() {
    this._players = new Map();
  }

  addPlayer(id, player) {
    this._players.set(id, player);
    debug('added player with id: ', id);
  }

  getPlayerById(id) {
    if (this._players.has(id)) {
      debug('matched existing player with id: ', id);
      return this._players.get(id);
    }
    return null;
  }
}

module.exports = PlayerList;
