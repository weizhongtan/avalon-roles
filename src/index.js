import WebSocket from 'ws';
import Koa from 'koa';
import http from 'http';
import serve from 'koa-static';
import { log } from './lib';
import EVENTS from './config';

const PORT = process.env.PORT || 8000;

const app = new Koa();
const server = http.createServer(app.callback());

app.use(serve('./dist'));

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('connected');
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    ws.send('something');
    setTimeout(() => ws.send('beans!'), 1000);
});

server.listen(PORT, () => {
    log(`listening on *:${PORT}`);
});
