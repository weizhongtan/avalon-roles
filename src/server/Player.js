const uuid = require('uuid/v4');

const { serialise } = require('../common');

class Player {
  constructor(socket) {
    this.id = uuid();
    this.name = null;
    this.character = null;
    this.setActive(true);
    this.setSocket(socket);
  }

  setActive(value) {
    this.active = value;
  }

  isActive() {
    return this.active;
  }

  setSocket(websocket) {
    this.socket = websocket;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  send(data, cb) {
    if (this.socket) {
      this.socket.send(serialise(data), cb);
    }
  }

  setCharacter(character) {
    this.character = character;
  }

  getCharacter() {
    return this.character;
  }

  viewOtherPlayer(otherPlayer) {
    return this.character.sees(otherPlayer.character);
  }

  serialise() {
    return this.name;
  }
}

module.exports = Player;
