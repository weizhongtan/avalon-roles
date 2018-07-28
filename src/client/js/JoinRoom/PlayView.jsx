import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';

import { CHARACTERS } from '../../../config';
import HorizontalList from './HorizontalList';
import PlayerViewList from './PlayerViewList';

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
