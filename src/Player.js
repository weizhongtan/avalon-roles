const uuid = require('uuid/v4');
const { serialise } = require('./lib');

class Player {
    constructor(socket) {
        this.id = uuid();
        this.socket = socket;
        this.character = null;
    }
    send(data) {
        this.socket.send(serialise(data));
    }
    assignCharacter(character) {
        if (character) {
            this.character = character;
        } else {
            // this.character = new Character();
        }
    }
}

module.exports = Player;
