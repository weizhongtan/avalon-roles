const Room = require('./Room');

describe('Room', () => {
  const id = 'id123';
  const characters = [
    'bean',
  ];
  let room;
  beforeEach(() => {
    room = new Room(id, characters);
  });
  it('creates an instance of Room', () => {
    expect(room).toBeInstanceOf(Room);
    expect(room.players).toBeInstanceOf(Set);
  });
});
