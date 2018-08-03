const Room = require('./Room');
const PlayerMock = require('./Player');
const TYPES = require('../config');

jest.mock('./Player');

const testID = 'id123';
const testCharacters = [
  'bean',
];
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

  describe('#add', () => {
    let player;

    beforeEach(() => {
      player = new PlayerMock(testSocket);
      player.serialise.mockReturnValue(testPlayerName);
    });

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
  });
});
