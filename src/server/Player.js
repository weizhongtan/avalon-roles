const uuid = require('uuid/v4');

const { serialise, types } = require('../common');

class Player {
  constructor(socket) {
    this.id = uuid();
    this.setName(null);
    this.setCharacter(null);
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

  setCharacter(character) {
    this.character = character;
  }

  getCharacter() {
    return this.character;
  }

  viewOtherPlayer(otherPlayer) {
    return this.character.sees(otherPlayer.character);
  }

  setPlayView(view) {
    this.playView = view;
  }

  getPlayView() {
    return this.playView;
  }

  notify(payload = {}, cb) {
    this._send({
      type: types.NOTIFY_CLIENT,
      payload: Object.assign({}, payload, {
        playerName: this.getName(),
        viewOfOtherPlayers: this.getPlayView()
      }),
    }, cb);
  }

  ack(payload, ackId, cb) {
    this._send({
      type: types.ACK,
      ackId,
      payload,
    }, cb);
  }

  _send(data, cb) {
    if (this.socket) {
      this.socket.send(serialise(data), cb);
    }
  }

  serialise() {
    return {
      name: this.name,
      isActive: this.isActive()
    };
  }
}

module.exports = Player;
