const { CHARACTERS } = require('../config');

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
  [CHARACTERS.MERLIN.id]: makeCharacterType(CHARACTERS.MERLIN.name, true, [CHARACTERS.STANDARD_EVIL.name, CHARACTERS.ASSASIN.name, CHARACTERS.MORGANA.name, CHARACTERS.OBERON.name], 'evil'),
  [CHARACTERS.PERCIVAL.id]: makeCharacterType(CHARACTERS.PERCIVAL.name, true, [CHARACTERS.MERLIN.name, CHARACTERS.MORGANA.name], 'Merlin or Morgana'),
  [CHARACTERS.STANDARD_GOOD.id]: makeCharacterType(CHARACTERS.STANDARD_GOOD.name, true, [], ''),
  [CHARACTERS.STANDARD_EVIL.id]: makeCharacterType(CHARACTERS.STANDARD_EVIL.name, false, [CHARACTERS.STANDARD_EVIL.name, CHARACTERS.ASSASIN.name, CHARACTERS.MORGANA.name, CHARACTERS.MORDRED.name], 'evil'),
  [CHARACTERS.ASSASIN.id]: makeCharacterType(CHARACTERS.ASSASIN.name, false, [CHARACTERS.STANDARD_EVIL.name, CHARACTERS.MORGANA.name, CHARACTERS.MORDRED.name], 'evil'),
  [CHARACTERS.MORGANA.id]: makeCharacterType(CHARACTERS.MORGANA.name, false, [CHARACTERS.STANDARD_EVIL.name, CHARACTERS.ASSASIN.name, CHARACTERS.MORDRED.name], 'evil'),
  [CHARACTERS.MORDRED.id]: makeCharacterType(CHARACTERS.MORDRED.name, false, [CHARACTERS.STANDARD_EVIL.name, CHARACTERS.ASSASIN.name, CHARACTERS.MORGANA.name], 'evil'),
  [CHARACTERS.OBERON.id]: makeCharacterType(CHARACTERS.OBERON.name, false, [], ''),
};

function getCharacterTypeByID(id) {
  return characterTypes[id];
}

module.exports = {
  getCharacterTypeByID,
};
