const debug = require('debug')('avalon:Room');
const uuidv4 = require('uuid/v4');

const { types, errors } = require('../common');
const Game = require('./Game');

class Room {
  constructor(selectedCharacterIds) {
    this.roomId = uuidv4().slice(0, 4).toUpperCase();
    this.selectedCharacterIds = selectedCharacterIds;
    this.players = new Set();
    this.createGame();
  }

  getId() {
    return this.roomId;
  }

  createGame() {
    this.game = new Game(this.selectedCharacterIds);
  }

  startGame() {
    const activePlayers = this.getActivePlayers();
    // if (activePlayers.length < this.selectedCharacterIds.length) {
    //   throw new Error(errors.NOT_ENOUGH_PLAYERS);
    // }
    this.game.addPlayers(activePlayers);
    this.game.start();
  }

  getPlayerByName(name) {
    return Array.from(this.players).find(p => p.getName() === name);
  }

  has(player) {
    return this.players.has(player);
  }

  add(player) {
    if (this.getActivePlayers().length >= this.selectedCharacterIds.length) {
      throw new Error('too many players');
    }
    this.players.add(player);
    this.notify();
  }

  remove(player) {
    const wasRemoved = this.players.delete(player);
    if (wasRemoved) {
      this.notify();
    }
    return wasRemoved;
  }

  getActivePlayers() {
    return Array.from(this.players).filter(p => p.isActive());
  }

  notify() {
    this.players.forEach(player => {
      player.notify({
        currentRoom: this.serialise(),
      });
    });
  }

  serialise() {
    const players = Array.from(this.players).map(p => p.serialise());
    return {
      roomId: this.roomId,
      selectedCharacterIds: this.selectedCharacterIds,
      members: players,
    };
  }
}

module.exports = Room;
