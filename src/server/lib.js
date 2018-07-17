const { CHARACTERS: CH } = require('../config');

function makeCharacterType(name, isGood, otherCharactersSeen,
                           seesOtherCharactersAs) {
  return class CharacterType {
    constructor() {
      this.name = name;
      this.isGood = isGood;
      this.otherCharactersSeen = otherCharactersSeen;
      this.seesOtherCharactersAs = seesOtherCharactersAs;
    }

    sees(character) {
      if (this.otherCharactersSeen.includes(character.name)) {
        return this.seesOtherCharactersAs;
      }
      return null;
    }
  };
}

function createCharacterTypes() {
  return {
    [CH.MERLIN]: makeCharacterType(CH.MERLIN, true, [CH.STANDARD_EVIL, CH.ASSASIN, CH.MORGANA, CH.OBERON], 'evil'),
    [CH.PERCIVAL]: makeCharacterType(CH.PERCIVAL, true, [CH.MERLIN, CH.MORGANA], 'Merlin or Morgana'),
    [CH.STANDARD_GOOD]: makeCharacterType(CH.STANDARD_GOOD, true, [], ''),
    [CH.STANDARD_EVIL]: makeCharacterType(CH.STANDARD_EVIL, false, [CH.STANDARD_EVIL, CH.ASSASIN, CH.MORGANA, CH.MORDRED], 'evil'),
    [CH.ASSASIN]: makeCharacterType(CH.ASSASIN, false, [CH.STANDARD_EVIL, CH.MORGANA, CH.MORDRED], 'evil'),
    [CH.MORGANA]: makeCharacterType(CH.MORGANA, false, [CH.STANDARD_EVIL, CH.ASSASIN, CH.MORDRED], 'evil'),
    [CH.MORDRED]: makeCharacterType(CH.MORDRED, false, [CH.STANDARD_EVIL, CH.ASSASIN, CH.MORGANA], 'evil'),
    [CH.OBERON]: makeCharacterType(CH.OBERON, false, [], ''),
  };
}

module.exports = {
  characterTypes: createCharacterTypes(),
};
