import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, List, Icon } from 'semantic-ui-react';

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

const HorizontalList = ({ elements }) => (
  <List horizontal>
    {elements.map((el, index) => (
      <List.Item key={index}>
        <Icon name='heart' />
        <List.Content>
          <List.Header>{el}</List.Header>
        </List.Content>
      </List.Item>
    ))}
  </List>
);

HorizontalList.propTypes = {
  elements: PropTypes.array.isRequired,
};

class PlayView extends Component {
  static propTypes = {
    assignedCharacter: PropTypes.object,
    viewOfOtherPlayers: PropTypes.object,
    currentRoom: PropTypes.object,
  };

  render() {
    const {
      assignedCharacter,
      viewOfOtherPlayers,
      currentRoom,
    } = this.props;

    return (
      <div>
        <Segment>
          {currentRoom.roomID && (
            <div>
              <Header >You are in room {currentRoom.roomID}</Header>
              <Header size='tiny'>Players in this room:</Header>
              <HorizontalList elements={currentRoom.members} />
              <Header size='tiny'>Available characters:</Header>
              <HorizontalList elements={currentRoom.selectedCharacterIDs} />
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
