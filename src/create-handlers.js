const Room = require('./Room');
const TYPES = require('./config');

module.exports = ({ roomList, player }) => {
    const handlers = {
        [TYPES.CREATE_ROOM]: (ack, roomName) => {
            if (roomList.get(roomName)) {
                return ack(`room ${roomName} already exists`);
            }
            const room = new Room(roomName);
            roomList.set(roomName, room);
            ack(`created room: ${roomName}`);
        },
        [TYPES.JOIN_ROOM]: (ack, roomName) => {
            if (roomList.has(roomName)) {
                // remove player from other rooms
                roomList.forEach((room) => {
                    room.remove(player);
                });
                const room = roomList.get(roomName);
                room.add(player);
                ack(`joined room: ${roomName}`);
            } else {
                ack(`room: ${roomName} does not exist`);
            }
        },
    };

    return handlers;
};
