const uuid = require('uuid/v4');
const { serialise } = require('../common');
const TYPES = require('../config');

class Player {
  constructor(socket) {
    this.id = uuid();
    this.name = null;
    this.socket = socket;
    this.character = null;
  }

  setName(name) {
    this.name = name;
    this.send({
      type: TYPES.UPDATE_PLAYER,
      payload: {
        name,
      },
    });
  }

  send(data) {
    this.socket.send(serialise(data));
  }

  assignCharacter(character) {
    this.character = character;
  }

  unassignCharacter() {
    this.character = null;
  }

  viewOtherPlayer(otherPlayer) {
    return this.character.sees(otherPlayer.character);
  }

  serialise() {
    return this.name;
  }
}

module.exports = Player;
