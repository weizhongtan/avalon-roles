const debug = require('debug');
const { wrapCallSite } = require('source-map-support');

module.exports = (...args) => {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (err, stack) => stack.map(wrapCallSite);
  const callSite = new Error().stack[1];
  const path = callSite
    .getFileName()
    .replace('.js', '')
    .split('/');
  const index = path.findIndex(part => part === 'index');
  const location =
    index === -1 ? path[path.length - 1] : path.slice(index - 1).join('/');
  debug(`avalon:${location}`)(...args);
  Error.prepareStackTrace = orig;
};
