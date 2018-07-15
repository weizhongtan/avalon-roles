const uuid = require('uuid/v4');
const { knuthShuffle } = require('knuth-shuffle');
const TYPES = require('../config');
const { characterTypes } = require('./lib');

class Room {
  constructor(name) {
    this.roomName = name;
    this.id = uuid();
    this.numberOfPlayers = null;
    this.players = new Set();
    this.characters = knuthShuffle([
      characterTypes.MERLIN,
      // characterTypes.PERCIVAL,
      // characterTypes.STANDARD_GOOD,
      characterTypes.ASSASIN,
      // characterTypes.MORGANA,
    ]);
  }

  setNumberOfPlayers(number) {
    this.numberOfPlayers = number;
  }

  startGame() {
    log('starting new game');
    this.players.forEach((player) => {
      const playerView = {};
      Array.from(this.players)
        .filter(p => p !== player)
        .forEach((otherPlayer) => {
          playerView[otherPlayer] = player.viewOtherPlayer(otherPlayer);
        });
      player.send({
        type: TYPES.UPDATE_PLAYER,
        payload: {
          playerView,
        },
      });
    });
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  randomlyAssignCharacters() {
    const characters = (new Set(this.characters)).values();
    const players = this.players.values();
    for (const player of players) {
      const character = characters.next().value;
      player.assignCharacter(character);
    }
    log(Array.from(this.players).map(p => p.character));
  }

  has(player) {
    return this.players.has(player);
  }

  add(player) {
    const wasAdded = this.players.add(player);
    if (wasAdded) {
      this.send({
        type: TYPES.UPDATE_ROOMS,
        payload: this.serialise(),
      });
    }
    if (this.players.size >= this.numberOfPlayers) {
      this.randomlyAssignCharacters();
      this.startGame();
    }
    return wasAdded;
  }

  remove(player) {
    const wasRemoved = this.players.delete(player);
    if (wasRemoved) {
      this.send({
        type: TYPES.UPDATE_ROOMS,
        payload: this.serialise(),
      });
    }
    return wasRemoved;
  }

  send(message) {
    this.players.forEach((player) => {
      player.send(message);
    });
  }

  serialise() {
    const players = Array.from(this.players).map(p => p.serialise());
    return {
      roomName: this.roomName,
      members: players,
    };
  }
}

module.exports = Room;
