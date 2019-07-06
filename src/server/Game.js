const debug = require('debug')(`avalon:${__filename}`);
const { knuthShuffle } = require('knuth-shuffle');

const { getCharacterTypeByID } = require('./lib');
const { errors } = require('../common');

class Game {
  constructor(charactersIds) {
    this.isStarted = false;
    this.charactersIds = charactersIds.slice(0);
  }

  start() {
    debug('starting new game');
    if (this.isStarted) {
      throw new Error(errors.GAME_IN_PROGRESS);
    }
    this.randomlyAssignCharacters();
    this.isStarted = true;
    this.players.forEach((player) => {
      const viewOfOtherPlayers = {};
      const otherPlayers = Array.from(this.players).filter(p => p !== player);
      otherPlayers.forEach((otherPlayer) => {
        viewOfOtherPlayers[otherPlayer.getName()] = player.viewOtherPlayer(otherPlayer);
      });
      player.setPlayView({
        viewOfOtherPlayers,
        assignedCharacter: player.getCharacter(),
      });
      player.notify();
    });
  }

  end() {
    this.isStarted = false;
  }

  addPlayers(players) {
    this.players = new Set(players);
  }

  randomlyAssignCharacters() {
    const shuffledCharacterIds = knuthShuffle(this.charactersIds);
    this.players.forEach((player) => {
      debug(shuffledCharacterIds);
      const characterID = shuffledCharacterIds.pop();
      const CharacterType = getCharacterTypeByID(characterID);
      const character = new CharacterType();
      player.setCharacter(character);
    });
  }
}

module.exports = Game;
