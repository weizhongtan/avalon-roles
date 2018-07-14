const uuid = require('uuid/v4');
const { serialise } = require('./lib');

class Room {
    constructor() {
        this.id = uuid();
        this.players = new Set();
    }
    add(player) {
        this.players.add(player);
    }
    send(message) {
        this.players.forEach((player) => {
            player.send(message);
        });
    }
}

module.exports = Room;
