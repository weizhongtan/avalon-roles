const Koa = require('koa');
const serve = require('koa-static');
const websockify = require('koa-websocket');
const route = require('koa-route');
const debug = require('debug')('avalon:app');

const { session, setSessionId } = require('./middleware/session');
const root = require('./routes/root');

const app = websockify(new Koa());

app.use(serve('./dist', { defer: true }));

app.keys = ['avalon-secret'];

const DISABLE_SESSION = !!process.env.DISABLE_SESSION;
if (DISABLE_SESSION) {
  debug('sessions disabled');
} else {
  app.use(session(app));
  app.use(setSessionId());
}

app.ws.use(route.get('/', root));

module.exports = app;
