const Room = require('./Room');
const PlayerMock = require('./Player');
const TYPES = require('../config');

jest.mock('./Player');

const testID = 'id123';
const testCharacters = ['merlin', 'morgana'];
const testSocket = {
  send: jest.fn(),
};
const testPlayerName = 'the beanernator';

describe('Room', () => {
  let room;

  beforeEach(() => {
    room = new Room(testID, testCharacters);
  });

  it('creates an instance of Room', () => {
    expect(room).toBeInstanceOf(Room);
    expect(room.players).toBeInstanceOf(Set);
  });

  describe('methods', () => {
    let player;

    beforeEach(() => {
      player = new PlayerMock(testSocket);
      player.serialise.mockReturnValue(testPlayerName);
    });

    describe('#add', () => {
      it('adds a player', () => {
        const res = room.add(player);
        expect(res).toBe(true);
        expect(room.players).toContain(player);
      });
      it('notifies all clients when a new player is added', () => {
        room.add(player);
        expect(player.send).toHaveBeenCalledWith({
          type: TYPES.UPDATE_CLIENT,
          payload: {
            currentRoom: {
              roomID: testID,
              selectedCharacterIDs: testCharacters,
              members: [testPlayerName],
            },
          },
        }, undefined); // no callback provided
      });
      it('does not add the player if the room is full', () => {
        room.add(player);
        const secondPlayer = new PlayerMock(testSocket);
        room.add(secondPlayer);
        const thirdPlayer = new PlayerMock(testSocket);
        const res = room.add(thirdPlayer);
        expect(res).toBe(false);
        expect(room.players).not.toContain(thirdPlayer);
      });
    });

    describe('#remove', () => {
      beforeEach(() => {
        room.add(player);
        player.send.mockClear();
      });

      it('removes a player', () => {
        const res = room.remove(player);
        expect(res).toBe(true);
        expect(room.players).not.toContain(player);
      });
      it('notifies all clients when a new player is removed', () => {
        const secondPlayer = new PlayerMock(testSocket);
        room.add(secondPlayer);
        room.remove(secondPlayer);
        expect(player.send).toHaveBeenCalledWith({
          type: TYPES.UPDATE_CLIENT,
          payload: {
            currentRoom: {
              roomID: testID,
              selectedCharacterIDs: testCharacters,
              members: [testPlayerName],
            },
          },
        }, undefined); // no callback provided
      });
    });
  });
});
