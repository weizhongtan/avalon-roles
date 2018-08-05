const { knuthShuffle } = require('knuth-shuffle');
const debug = require('debug')('avalon:Room');

const TYPES = require('../config');
const { characterTypes } = require('./lib');

class Room {
  constructor(id, selectedCharacterIDs) {
    this.roomID = id;
    this.selectedCharacterIDs = selectedCharacterIDs;
    this.players = new Set();

    this.gameStarted = false;
  }

  tryStartGame() {
    if (this.gameStarted) {
      debug('game cannot be started: game is already in progress');
      return false;
    }
    if (Array.from(this.players).filter(p => p.isActive()).length < this.selectedCharacterIDs.length) {
      debug('game cannot be started: not enough active players');
      return false;
    }
    this.gameStarted = true;
    debug('starting new game');
    this.randomlyAssignCharacters();
    this.players.forEach((player) => {
      const playerView = {};
      const otherPlayers = Array.from(this.players).filter(p => p !== player);
      otherPlayers.forEach((otherPlayer) => {
        playerView[otherPlayer.getName()] = player.viewOtherPlayer(otherPlayer);
      });
      player.send({
        type: TYPES.UPDATE_CLIENT,
        payload: {
          playerView,
          assignedCharacter: player.getCharacter(),
        },
      }, (err) => {
        if (err) {
          debug('Failed to send data to player');
          this.remove(player);
        }
      });
    });
    return true;
  }

  randomlyAssignCharacters() {
    this.selectedCharacterIDs = knuthShuffle(this.selectedCharacterIDs);
    let i = 0;
    this.players.forEach((player) => {
      debug(this.selectedCharacterIDs);
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
    if (this.players.size >= this.selectedCharacterIDs.length) {
      return false;
    }
    const wasAdded = !!this.players.add(player);
    if (wasAdded) {
      this.updateClients();
    }
    return wasAdded;
  }

  remove(player) {
    const wasRemoved = this.players.delete(player);
    if (wasRemoved) {
      this.updateClients();
    }
    return wasRemoved;
  }

  updateClients() {
    this.send({
      type: TYPES.UPDATE_CLIENT,
      payload: {
        currentRoom: this.serialise(),
      },
    });
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
