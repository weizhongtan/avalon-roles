class CharacterType {
  constructor(name, isGood, otherCharactersSeen, seesOtherCharactersAs) {
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
}

module.exports = CharacterType;
