const { serialise, types } = require('../../common');

class Player {
  constructor(socket) {
    this.setName(null);
    this.setCharacter(null);
    this.setSocket(socket);
  }

  isActive() {
    return !!this.socket;
  }

  setSocket(websocket) {
    this.socket = websocket;
  }

  setName(name) {
    this._name = name;
  }

  getName() {
    return this._name;
  }

  setCharacter(character) {
    this._character = character;
  }

  getCharacter() {
    return this._character;
  }

  viewOtherPlayer(otherPlayer) {
    return this._character.sees(otherPlayer.getCharacter());
  }

  setPlayView(view) {
    this._playView = view;
  }

  getPlayView() {
    return this._playView;
  }

  notify(payload = {}, cb) {
    this._send(
      {
        type: types.NOTIFY_CLIENT,
        payload: Object.assign({}, payload, {
          playerName: this.getName(),
          viewOfOtherPlayers: this.getPlayView(),
        }),
      },
      cb
    );
  }

  ack(payload, ackId, cb) {
    this._send(
      {
        type: types.ACK,
        ackId,
        payload,
      },
      cb
    );
  }

  _send(data, cb) {
    if (this.socket) {
      this.socket.send(serialise(data), cb);
    }
  }

  serialise() {
    return {
      name: this._name,
      isActive: this.isActive(),
    };
  }
}

module.exports = Player;
