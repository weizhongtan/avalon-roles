import React from 'react';
import PropTypes from 'prop-types';
import { Header, Segment, Button, List, Icon } from 'semantic-ui-react';

import { CHARACTERS } from '../../../../config';
import PlayerViewList from './PlayerViewList';

import { getRandomIcon } from '../../lib';

const PlayView = ({ playerName, assignedCharacter, viewOfOtherPlayers, currentRoom, onStartGame }) => {
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
        {currentRoom.roomId && (
          <div>
            <Header block>Your name: {playerName}</Header>
            <Header block>Current room: {currentRoom.roomId}</Header>
            <Header size='tiny'>Players in this room:</Header>
            <List horizontal relaxed>
              {currentRoom.members.map(({ name, isActive }) => (
                <List.Item key={name}>
                  <List.Content>
                    <List.Header style={{
                      color: isActive ? 'black' : 'grey'
                    }}>{name}</List.Header>
                    <List.Description>
                      {!isActive ? 'is inactive' : ''}
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
            <Header size='tiny'>Available characters:</Header>
            <List horizontal relaxed>
              {characterStrings.map(character => (
                <List.Item key={character}>
                  <Icon name={getRandomIcon()} />
                  <List.Content>
                    <List.Header>{character}</List.Header>
                  </List.Content>
                </List.Item>
              ))}
            </List>
            <Button
              content='Start game'
              onClick={onStartGame}
            />
          </div>
        )}
      </Segment>
      {assignedCharacter && viewOfOtherPlayers && (
        <Segment>
          <Header>You are {assignedCharacter.name}</Header>
          <PlayerViewList viewOfOtherPlayers={viewOfOtherPlayers} />
        </Segment>
      )}
    </div>
  );
};

PlayView.propTypes = {
  playerName: PropTypes.string,
  assignedCharacter: PropTypes.object,
  viewOfOtherPlayers: PropTypes.object,
  currentRoom: PropTypes.object,
  onStartGame: PropTypes.func.isRequired,
};

export default PlayView;
