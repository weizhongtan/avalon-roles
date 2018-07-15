const TYPES = require('./config');
const CharacterType = require('./CharacterType');

function serialise({
    type,
    payload,
    ackId = null,
}) {
    if (!Object.prototype.hasOwnProperty.call(TYPES, type)) {
        throw new Error(`type ${type} is not supported`);
    }
    return JSON.stringify({
        type,
        payload,
        ackId,
    });
}

const STANDARD_GOOD = 'a Loyal Servant of Arthur';
const STANDARD_EVIL = 'a Minion of Mordred';
const ASSASIN = 'the Assassin';
const MERLIN = 'Merlin';
const PERCIVAL = 'Percival';
const MORGANA = 'Morgana';
const MORDRED = 'Mordred';
const OBERON = 'Oberon';

function createCharacterTypes() {
    return {
        MERLIN: new CharacterType(MERLIN, true, [STANDARD_EVIL, ASSASIN, MORGANA, OBERON], 'evil'),
        PERCIVAL: new CharacterType(PERCIVAL, true, [MERLIN, MORGANA], 'Merlin or Morgana'),
        STANDARD_GOOD: new CharacterType(STANDARD_GOOD, true, [], ''),
        STANDARD_EVIL: new CharacterType(STANDARD_EVIL, false, [STANDARD_EVIL, ASSASIN, MORGANA, MORDRED], 'evil'),
        ASSASIN: new CharacterType(ASSASIN, false, [STANDARD_EVIL, MORGANA, MORDRED], 'evil'),
        MORGANA: new CharacterType(MORGANA, false, [STANDARD_EVIL, ASSASIN, MORDRED], 'evil'),
        MORDRED: new CharacterType(MORDRED, false, [STANDARD_EVIL, ASSASIN, MORGANA], 'evil'),
        OBERON: new CharacterType(OBERON, false, [], ''),
    };
}

module.exports = {
    serialise,
    characterTypes: createCharacterTypes(),
};
