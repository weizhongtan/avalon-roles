const TYPES = require('./config');

function serialise({
  type,
  payload,
  ackID = null,
}) {
  if (!TYPES[type]) {
    throw new Error(`type ${type} is not supported`);
  }
  return JSON.stringify({
    type,
    payload,
    ackID,
  });
}

function deserialise(data) {
  return JSON.parse(data);
}

module.exports = {
  serialise,
  deserialise,
};
