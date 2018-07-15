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

module.exports = {
    serialise,
};
