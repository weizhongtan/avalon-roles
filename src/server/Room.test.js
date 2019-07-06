const Room = require('./Room');
const PlayerMock = require('./Player');
const { types } = require('../common');

jest.mock('./Player');

const testID = 'ab12';
const testCharacters = [0, 1];
const testSocket = {
  send: jest.fn(),
};
const testPlayerName = 'player 1';
const testSecondPlayerName = 'player 2';

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
    let secondPlayer;

    beforeEach(() => {
      player = new PlayerMock(testSocket);
      player.serialise.mockReturnValue(testPlayerName);
      player.isActive.mockReturnValue(true);
      secondPlayer = new PlayerMock(testSocket);
      secondPlayer.serialise.mockReturnValue(testSecondPlayerName);
      secondPlayer.isActive.mockReturnValue(true);
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
          type: types.NOTIFY_CLIENT,
          payload: {
            currentRoom: {
              roomId: testID,
              selectedCharacterIds: testCharacters,
              members: [testPlayerName],
            },
          },
        }, undefined); // no callback provided
      });
      it('does not add the player if the room is full', () => {
        room.add(player);
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
        room.add(secondPlayer);
        room.remove(secondPlayer);
        expect(player.send).toHaveBeenCalledWith({
          type: types.NOTIFY_CLIENT,
          payload: {
            currentRoom: {
              roomId: testID,
              selectedCharacterIds: testCharacters,
              members: [testPlayerName],
            },
          },
        }, undefined); // no callback provided
      });
    });

    describe('#randomlyAssignCharacters', () => {
      beforeEach(() => {
        room.add(player);
        room.add(secondPlayer);
      });

      it('assigns a character to each player', () => {
        room.randomlyAssignCharacters();
        expect(player.setCharacter).toHaveBeenCalledTimes(1);
        expect(secondPlayer.setCharacter).toHaveBeenCalledTimes(1);
        const playerCharacter = player.setCharacter.mock.calls[0];
        const secondPlayerCharacter = secondPlayer.setCharacter.mock.calls[0];
        expect(playerCharacter).not.toBe(secondPlayerCharacter);
      });
    });

    describe('#tryStartGame', () => {
      beforeEach(() => {
        room.add(player);
        room.add(secondPlayer);
        player.send.mockClear();
        secondPlayer.send.mockClear();
      });

      it('does not start the game if there are not enough active players', () => {
        room.remove(secondPlayer);
        const res = room.tryStartGame();
        expect(res).toBe(false);
      });

      it('starts the game', () => {
        const res = room.tryStartGame();
        expect(res).toBe(true);
        expect(player.send).toHaveBeenCalledTimes(1);
        expect(secondPlayer.send).toHaveBeenCalledTimes(1);
      });

      it('does not start a game if the game is already in progress', () => {
        room.tryStartGame();
        const res = room.tryStartGame();
        expect(res).toBe(false);
      });
    });
  });
});
