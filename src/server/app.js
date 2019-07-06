const Koa = require('koa');
const serve = require('koa-static');
const websockify = require('koa-websocket');
const route = require('koa-route');

const { session, setSessionId } = require('./middleware/session');
const { log } = require('../common');
const channel = require('./routes/channel');
const features = require('./features');

const app = websockify(new Koa());

app.use(
  serve('./dist', {
    defer: true,
  })
);

app.keys = ['avalon-secret'];

if (features.session) {
  app.use(session(app));
  app.use(setSessionId());
} else {
  log('sessions disabled');
}

log('test');

app.ws.use(route.get('/', channel));

module.exports = app;
