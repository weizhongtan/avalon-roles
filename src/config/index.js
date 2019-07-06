module.exports = {
  JOIN_ROOM: 'JOIN_ROOM',
  CREATE_ROOM: 'CREATE_ROOM',
  START_GAME: 'START_GAME',
  ACK: 'ACK',
  NOTIFY_CLIENT: 'NOTIFY_CLIENT',
};

const CHARACTERS = {
  MERLIN: { id: 0, name: 'Merlin', isGood: true },
  STANDARD_GOOD: { id: 1, name: 'a Loyal Servant of Arthur', isGood: true },
  PERCIVAL: { id: 2, name: 'Percival', isGood: true },
  STANDARD_EVIL: { id: 3, name: 'a Minion of Mordred', isGood: false },
  ASSASIN: { id: 4, name: 'the Assassin', isGood: false },
  MORGANA: { id: 5, name: 'Morgana', isGood: false },
  MORDRED: { id: 6, name: 'Mordred', isGood: false },
  OBERON: { id: 7, name: 'Oberon', isGood: false },
};

module.exports.CHARACTERS = CHARACTERS;
