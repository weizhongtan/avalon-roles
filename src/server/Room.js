const uuidv4 = require('uuid/v4');

const { errors } = require('../common');
const Game = require('./Game');

class Room {
  constructor(selectedCharacterIds) {
    this._id = uuidv4().slice(0, 4).toUpperCase();
    this._selectedCharacterIds = selectedCharacterIds;
    this._players = new Set();
    this.createGame();
  }

  getId() {
    return this._id;
  }

  createGame() {
    this._game = new Game(this._selectedCharacterIds);
  }

  startGame() {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length < this._selectedCharacterIds.length) {
      throw new Error(errors.NOT_ENOUGH_PLAYERS);
    }
    this._game.addPlayers(activePlayers);
    this._game.start();
  }

  getPlayerByName(name) {
    return Array.from(this._players).find(p => p.getName() === name);
  }

  has(player) {
    return this._players.has(player);
  }

  add(player) {
    if (this.getActivePlayers().length >= this._selectedCharacterIds.length) {
      throw new Error('too many players');
    }
    this._players.add(player);
    this.notify();
  }

  remove(player) {
    const wasRemoved = this._players.delete(player);
    if (wasRemoved) {
      this.notify();
    }
    return wasRemoved;
  }

  getActivePlayers() {
    return Array.from(this._players).filter(p => p.isActive());
  }

  notify() {
    this._players.forEach(player => {
      player.notify({
        currentRoom: this.serialise(),
      });
    });
  }

  serialise() {
    const players = Array.from(this._players).map(p => p.serialise());
    return {
      roomId: this._id,
      selectedCharacterIds: this._selectedCharacterIds,
      members: players,
    };
  }
}

module.exports = Room;
