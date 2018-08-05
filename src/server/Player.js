const uuid = require('uuid/v4');
const debug = require('debug')('avalon:Player');

const { serialise } = require('../common');

class Player {
  constructor(socket) {
    this.id = uuid();
    this.name = null;
    this.character = null;
    this.active = true;
    this.socket = socket;
  }

  setActive(value) {
    debug('player active flag set:', value);
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
    this.socket.send(serialise(data), cb);
  }

  assignCharacter(character) {
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
