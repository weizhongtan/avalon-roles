import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, List, Icon } from 'semantic-ui-react';

import { CHARACTERS } from '../../../config';
import { getRandomIcon } from '../lib';

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
  <List horizontal relaxed>
    {elements.map((el, index) => (
      <List.Item key={index}>
        <Icon name={getRandomIcon()} />
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

    const characterCounts = {};
    currentRoom.selectedCharacterIDs.forEach((id) => {
      const { name } = Object.values(CHARACTERS)[id];
      if (characterCounts[name]) {
        characterCounts[name] += 1;
      } else {
        characterCounts[name] = 1;
      }
    });

    const characterStrings = Object.entries(characterCounts)
      .map(([key, val]) => (val > 1 ? `${key} x${val}` : key));

    return (
      <div>
        <Segment>
          {currentRoom.roomID && (
            <div>
              <Header block>Current room: {currentRoom.roomID}</Header>
              <Header size='tiny'>Players in this room:</Header>
              <HorizontalList elements={currentRoom.members} />
              <Header size='tiny'>Available characters:</Header>
              <HorizontalList elements={characterStrings} />
            </div>
          )}
        </Segment>
        <Segment>
          {assignedCharacter && <Header>You are {CHARACTERS[assignedCharacter].name}</Header>}
          {viewOfOtherPlayers && <PlayerViewList viewOfOtherPlayers={viewOfOtherPlayers} />}
        </Segment>
      </div>
    );
  }
}

export default PlayView;
