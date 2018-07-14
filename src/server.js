const WebSocket = require('ws');
const Koa = require('koa');
const debug = require('debug');
const http = require('http');
const serve = require('koa-static');

const TYPES = require('./config');
const Player = require('./Player');
const createHandlers = require('./create-handlers');

global.log = debug('avalon');
const PORT = process.env.PORT || 8000;

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

app.use(serve('./dist'));

const roomList = new Map();



wss.on('connection', (ws) => {
    log('client connected');

    const player = new Player(ws);
    const {
        handleCreateRoom,
        handleJoinRoom,
    } = createHandlers({ roomList, player });

    ws.on('message', (json) => {
        log('received: %s', json);
        const { type, payload, ackId } = JSON.parse(json);
        switch (type) {
        case TYPES.CREATE_ROOM:
            handleCreateRoom(ackId, payload);
            break;
        case TYPES.JOIN_ROOM: {
            handleJoinRoom(ackId, player, payload);
            break;
        }
        default:
            log('unsupported type', type);
        }
        log('roomList:', roomList);
    });
});

server.listen(PORT, (err) => {
    if (err) {
        throw err;
    }
    log(`listening on *:${PORT}`);
});
