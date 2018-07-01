import socketio from 'socket.io';
import Koa from 'koa';
import http from 'http';
import serve from 'koa-static';
import { log } from './lib';
import EVENTS from './config';

const PORT = process.env.PORT || 8000;

const app = new Koa();
const server = http.createServer(app.callback());
const io = socketio(server);

app.use(serve('./dist'));

function onConnection(socket) {
    log('client connected');
    socket.on(EVENTS.JOIN_ROOM, ({ roomId }) => {
        socket.join(roomId, () => {
            io.in(roomId).clients((err, clients) => {
                io.to(roomId).emit(EVENTS.UPDATE_ROOMS, { rooms: clients });
            });
        });
    });
}

io.on('connection', onConnection);

server.listen(PORT, () => {
    log(`listening on *:${PORT}`);
});
