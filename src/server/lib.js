const { characters } = require('../common');

function makeCharacterType(name, isGood, otherCharactersSeen, seesOtherCharactersAs) {
  return class CharacterType {
    constructor() {
      this.name = name;
      this.isGood = isGood;
      this.otherCharactersSeen = otherCharactersSeen;
      this.seesOtherCharactersAs = seesOtherCharactersAs;
    }

    getName() {
      return this.name;
    }

    sees(character) {
      if (this.otherCharactersSeen.includes(character.getName())) {
        return this.seesOtherCharactersAs;
      }
      return null;
    }
  };
}

const characterTypes = {
  [characters.MERLIN.id]: makeCharacterType(characters.MERLIN.name, true, [characters.STANDARD_EVIL.name, characters.ASSASIN.name, characters.MORGANA.name, characters.OBERON.name], 'evil'),
  [characters.PERCIVAL.id]: makeCharacterType(characters.PERCIVAL.name, true, [characters.MERLIN.name, characters.MORGANA.name], 'Merlin or Morgana'),
  [characters.STANDARD_GOOD.id]: makeCharacterType(characters.STANDARD_GOOD.name, true, [], ''),
  [characters.STANDARD_EVIL.id]: makeCharacterType(characters.STANDARD_EVIL.name, false, [characters.STANDARD_EVIL.name, characters.ASSASIN.name, characters.MORGANA.name, characters.MORDRED.name], 'evil'),
  [characters.ASSASIN.id]: makeCharacterType(characters.ASSASIN.name, false, [characters.STANDARD_EVIL.name, characters.MORGANA.name, characters.MORDRED.name], 'evil'),
  [characters.MORGANA.id]: makeCharacterType(characters.MORGANA.name, false, [characters.STANDARD_EVIL.name, characters.ASSASIN.name, characters.MORDRED.name], 'evil'),
  [characters.MORDRED.id]: makeCharacterType(characters.MORDRED.name, false, [characters.STANDARD_EVIL.name, characters.ASSASIN.name, characters.MORGANA.name], 'evil'),
  [characters.OBERON.id]: makeCharacterType(characters.OBERON.name, false, [], ''),
};

function getCharacterTypeByID(id) {
  return characterTypes[id];
}

module.exports = {
  getCharacterTypeByID,
};
