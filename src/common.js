const TYPES = require('./config');

exports.serialise = ({
  type,
  payload,
  ackId = null,
}) => {
  if (!TYPES[type]) {
    throw new Error(`type ${type} is not supported`);
  }
  return JSON.stringify({
    type,
    payload,
    ackId,
  });
};

exports.deserialise = (data) => {
  return JSON.parse(data);
};

exports.errors = {
  DUPLICATE_NAME: 'Sorry, that name is already taken',
  INVALID_ROOM_ID: 'Room Id does not exist',
};
