import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';

const PlayerViewItem = ({ otherPlayer, viewedAs }) => (
  <li>{otherPlayer} is {viewedAs || 'unknown.'}</li>
);

PlayerViewItem.propTypes = {
  otherPlayer: PropTypes.string.isRequired,
  viewedAs: PropTypes.string,
};

const PlayerViewList = ({ viewOfOtherPlayers }) => {
  const views = Object.entries(viewOfOtherPlayers);

  return (
    <ul>
      {views.map(([player, view]) => (
        <PlayerViewItem key={player} otherPlayer={player} viewedAs={view} />
      ))}
    </ul>
  );
};

PlayerViewList.propTypes = {
  viewOfOtherPlayers: PropTypes.object.isRequired,
};

class PlayView extends Component {
  static propTypes = {
    assignedCharacter: PropTypes.object,
    viewOfOtherPlayers: PropTypes.object,
    currentRoom: PropTypes.object,
  };

  render() {
    const { assignedCharacter, viewOfOtherPlayers, currentRoom } = this.props;
    const membersList = currentRoom.members.join(',');
    return (
      <div>
        <Segment>
          {currentRoom.roomID && (
            <div>
              <Header>{currentRoom.roomID}</Header>
              <p>Players in this room: {membersList}</p>
            </div>
          )}
        </Segment>
        <Segment>
          {assignedCharacter && <Header>You are {assignedCharacter.name}</Header>}
          {viewOfOtherPlayers && <PlayerViewList viewOfOtherPlayers={viewOfOtherPlayers} />}
        </Segment>
      </div>
    );
  }
}

export default PlayView;
