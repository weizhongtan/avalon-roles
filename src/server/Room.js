const { knuthShuffle } = require('knuth-shuffle');
const debug = require('debug')('avalon:Room');
const uuidv4 = require('uuid/v4');

const TYPES = require('../config');
const { getCharacterTypeByID } = require('./lib');
const { errors } = require('../common');

class Room {
  constructor(selectedCharacterIDs) {
    this.roomId = uuidv4().slice(0, 4).toUpperCase();
    this.selectedCharacterIDs = selectedCharacterIDs;
    this.players = new Set();

    this.gameStarted = false;
  }

  getId() {
    return this.roomId;
  }

  startGame() {
    if (this.gameStarted) {
      throw new Error(errors.GAME_IN_PROGRESS);
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
        type: TYPES.NOTIFY_CLIENT,
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
      const CharacterType = getCharacterTypeByID(characterID);
      const character = new CharacterType();
      player.setCharacter(character);
    });
  }

  getPlayerByName(name) {
    return Array.from(this.players).find(p => p.getName() === name);
  }

  has(player) {
    return this.players.has(player);
  }

  add(player) {
    const players = Array.from(this.players).filter(p => p.isActive());
    if (players.length >= this.selectedCharacterIDs.length) {
      return false;
    }
    const wasAdded = !!this.players.add(player);
    if (wasAdded) {
      this.notifyClients();
    }
    return wasAdded;
  }

  remove(player) {
    const wasRemoved = this.players.delete(player);
    if (wasRemoved) {
      this.notifyClients();
    }
    return wasRemoved;
  }

  notifyClients() {
    this.send({
      type: TYPES.NOTIFY_CLIENT,
      payload: {
        currentRoom: this.serialise(),
      },
    });
  }

  send(message, cb) {
    this.players.forEach((player) => {
      const payload = Object.assign({}, message.payload, {
        playerName: player.getName()
      });
      player.send(Object.assign({}, message, {
        payload
      }), cb);
    });
  }

  serialise() {
    const players = Array.from(this.players).map(p => p.serialise());
    return {
      roomId: this.roomId,
      selectedCharacterIDs: this.selectedCharacterIDs,
      members: players,
    };
  }
}

module.exports = Room;
