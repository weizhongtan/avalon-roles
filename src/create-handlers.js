const Room = require('./Room');
const TYPES = require('./config');

module.exports = ({ roomList, player }) => {
    function handleCreateRoom(ackId, roomName) {
        const room = new Room();
        roomList.set(roomName, room);
        player.send({
            ackId,
            type: TYPES.UPDATE_ROOMS,
            payload: `created room: ${roomName}`,
        });
    }

    function handleJoinRoom(ackId, roomName) {
        if (roomList.has(roomName)) {
            const room = roomList.get(roomName);
            room.add(player);
        }
        player.send({
            ackId,
            type: TYPES.UPDATE_ROOMS,
            payload: `joined room: ${roomName}`,
        });
    }

    return {
        handleCreateRoom,
        handleJoinRoom,
    };
};
