const uuid = require('uuid/v4');

class Player {
    constructor(socket) {
        this.id = uuid();
        this.socket = socket;
    }
}

module.exports = Player;
