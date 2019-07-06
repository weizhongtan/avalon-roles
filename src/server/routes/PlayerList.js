const { log } = require('../../common');

class PlayerList {
  constructor() {
    this._players = new Map();
  }

  addPlayer(id, player) {
    this._players.set(id, player);
    log('added player with id: ', id);
  }

  getPlayerById(id) {
    if (this._players.has(id)) {
      log('matched existing player with id: ', id);
      return this._players.get(id);
    }
    return null;
  }
}

module.exports = PlayerList;
