const uuid = require('uuid/v4');

class Character {
    constructor(socket) {
        this.id = uuid();
        this.socket = socket;
    }
}

module.exports = Character;
