const WebSocket = require('ws');
const Koa = require('koa');
const http = require('http');
const debug = require('debug')('server');
const serve = require('koa-static');
const EVENTS = require('./config');
const { message } = require('./lib');
const Player = require('./Player');

const PORT = process.env.PORT || 8000;

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

app.use(serve('./dist'));

wss.on('connection', (ws) => {
    debug('client connected');
    ws.on('message', (json) => {
        debug('received: %s', json);
    });
});

server.listen(PORT, () => {
    debug(`listening on *:${PORT}`);
});
