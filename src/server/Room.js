const { knuthShuffle } = require('knuth-shuffle');
const TYPES = require('../config');
const { characterTypes } = require('./lib');

class Room {
  constructor(id, selectedCharacterIDs) {
    this.roomID = id;
    this.selectedCharacterIDs = selectedCharacterIDs;
    this.players = new Set();
  }

  startGame() {
    log('starting new game');
    this.players.forEach((player) => {
      const playerView = {};
      const otherPlayers = Array.from(this.players).filter(p => p !== player);
      otherPlayers.forEach((otherPlayer) => {
        playerView[otherPlayer.name] = player.viewOtherPlayer(otherPlayer);
      });
      player.send({
        type: TYPES.UPDATE_CLIENT,
        payload: {
          playerView,
          assignedCharacter: player.character,
        },
      }, (err) => {
        if (err) {
          log('Failed to send data to player');
          this.remove(player);
        }
      });
    });
  }

  randomlyAssignCharacters() {
    this.selectedCharacterIDs = knuthShuffle(this.selectedCharacterIDs);
    let i = 0;
    this.players.forEach((player) => {
      log(this.selectedCharacterIDs);
      const characterID = this.selectedCharacterIDs[i++]; // eslint-disable-line
      const CharacterType = characterTypes[characterID];
      const character = new CharacterType();
      player.assignCharacter(character);
    });
  }

  has(player) {
    return this.players.has(player);
  }

  add(player) {
    if (this.players.length >= this.selectedCharacterIDs.length) {
      return false;
    }
    const wasAdded = this.players.add(player);
    if (wasAdded) {
      this.send({
        type: TYPES.UPDATE_CLIENT,
        payload: {
          currentRoom: this.serialise(),
        },
      });
    }
    if (this.players.size >= this.selectedCharacterIDs.length) {
      this.randomlyAssignCharacters();
      this.startGame();
    }
    return wasAdded;
  }

  remove(player) {
    const wasRemoved = this.players.delete(player);
    if (wasRemoved) {
      this.send({
        type: TYPES.UPDATE_CLIENT,
        payload: {
          currentRoom: this.serialise(),
        },
      });
    }
    return wasRemoved;
  }

  send(message, cb) {
    this.players.forEach((player) => {
      player.send(message, cb);
    });
  }

  serialise() {
    const players = Array.from(this.players).map(p => p.serialise());
    return {
      roomID: this.roomID,
      selectedCharacterIDs: this.selectedCharacterIDs,
      members: players,
    };
  }
}

module.exports = Room;
