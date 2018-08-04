// @flow

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

function deserialise(data: object) {
  return JSON.parse(data);
}

function test(a, b) {
  return a + b;
}

test(1, 2);

module.exports = {
  serialise,
  deserialise,
};
