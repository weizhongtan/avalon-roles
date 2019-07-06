const debug = require('debug');

exports.types = {
  JOIN_ROOM: 'JOIN_ROOM',
  CREATE_ROOM: 'CREATE_ROOM',
  START_GAME: 'START_GAME',
  ACK: 'ACK',
  NOTIFY_CLIENT: 'NOTIFY_CLIENT',
};

exports.characters = {
  MERLIN: { id: 0, name: 'Merlin', isGood: true },
  STANDARD_GOOD: { id: 1, name: 'a Loyal Servant of Arthur', isGood: true },
  PERCIVAL: { id: 2, name: 'Percival', isGood: true },
  STANDARD_EVIL: { id: 3, name: 'a Minion of Mordred', isGood: false },
  ASSASIN: { id: 4, name: 'the Assassin', isGood: false },
  MORGANA: { id: 5, name: 'Morgana', isGood: false },
  MORDRED: { id: 6, name: 'Mordred', isGood: false },
  OBERON: { id: 7, name: 'Oberon', isGood: false },
};

exports.serialise = ({ type, payload, ackId = null }) => {
  if (!exports.types[type]) {
    throw new Error(`type ${type} is not supported`);
  }
  return JSON.stringify({
    type,
    payload,
    ackId,
  });
};

exports.deserialise = data => {
  return JSON.parse(data);
};

exports.errors = {
  DUPLICATE_NAME: 'Sorry, that name is already taken',
  INVALID_ROOM_ID: 'Room Id does not exist',
  GAME_IN_PROGRESS: 'This game is already in progress',
  NOT_ENOUGH_PLAYERS: 'Not enough players',
};

exports.log = s => {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (err, stack) => stack;
  const callSite = new Error().stack[1];
  const path = callSite
    .getFileName()
    .replace('.js', '')
    .split('/');
  const index = path.findIndex(part => part === 'index');
  const location =
    index === -1 ? path[path.length - 1] : path.slice(index - 1).join('/');
  debug(`avalon:${location}`)(s);
  Error.prepareStackTrace = orig;
};
