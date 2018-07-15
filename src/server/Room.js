const uuid = require('uuid/v4');
const { knuthShuffle } = require('knuth-shuffle');
const TYPES = require('../config');
const { characterTypes } = require('./lib');

class Room {
    constructor(name) {
        this.roomName = name;
        this.id = uuid();
        this.players = new Set();
        this.characters = knuthShuffle([
            characterTypes.MERLIN,
            characterTypes.PERCIVAL,
            characterTypes.STANDARD_GOOD,
            characterTypes.ASSASIN,
            characterTypes.MORGANA,
        ]);
    }
    startGame() {

    }
    addCharacter(character) {
        this.characters.push(character);
    }
    randomlyAssignCharacters() {
        for (let i = 0; i < this.players.length; i += 1) {
            this.players[i].assignCharacter(this.characters[i]);
        }
    }
    has(player) {
        return this.players.has(player);
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
        const players = Array.from(this.players).map(p => p.serialise());
        return {
            roomName: this.roomName,
            members: players,
        };
    }
}

module.exports = Room;
