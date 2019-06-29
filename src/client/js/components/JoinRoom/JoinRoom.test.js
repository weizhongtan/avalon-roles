import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router-dom';

import JoinRoom from './JoinRoom';

describe ('JoinRoom', () => {
  let onJoinRoomMock;
  let onStartGameMock;
  let onJoinRoomMock;

  beforeEach(() => {
    onJoinRoomMock = jest.fn();
    onStartGameMock = jest.fn();
    onJoinRoomMock = jest.fn();
  });

  it('renders correctly', () => {
    const tree = renderer
      .create(
        <StaticRouter>
          <JoinRoom
            onJoinRoom={onJoinRoomMock}
            onJoinRoom={onStartGameMock}
            onJoinRoom={onJoinRoomMock}
          />
        </StaticRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

