const TYPES = require('./config');

function serialise({
  type,
  payload,
  ackId = null,
}) {
  if (!TYPES[type]) {
    throw new Error(`type ${type} is not supported`);
  }
  return JSON.stringify({
    type,
    payload,
    ackId,
  });
}

function deserialise(data) {
  return JSON.parse(data);
}

module.exports = {
  serialise,
  deserialise,
};
