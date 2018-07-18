const uuid = require('uuid/v4');
const { serialise } = require('../common');

class Player {
  constructor(socket) {
    this.id = uuid();
    this.name = null;
    this.socket = socket;
    this.character = null;
  }

  setName(name) {
    this.name = name;
  }

  send(data, cb) {
    this.socket.send(serialise(data), cb);
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
