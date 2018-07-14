const uuid = require('uuid/v4');
const TYPES = require('./config');

class Room {
    constructor(name) {
        this.roomName = name;
        this.id = uuid();
        this.players = new Set();
    }
    startGame() {

    }
    randomlyAssignCharacters() {

    }
    add(player) {
        const wasAdded = this.players.add(player);
        if (wasAdded) {
            this.send({
                type: TYPES.UPDATE_ROOMS,
                payload: this.serialise(),
            });
        }
        return wasAdded;
    }
    remove(player) {
        const wasRemoved = this.players.delete(player);
        if (wasRemoved) {
            this.send({
                type: TYPES.UPDATE_ROOMS,
                payload: this.serialise(),
            });
        }
        return wasRemoved;
    }
    send(message) {
        this.players.forEach((player) => {
            player.send(message);
        });
    }
    serialise() {
        const players = Array.from(this.players).map(p => p.id);
        return {
            roomName: this.roomName,
            members: players,
        };
    }
}

module.exports = Room;
