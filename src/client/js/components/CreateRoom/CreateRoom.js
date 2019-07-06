import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CreateRoomForm from './CreateRoomForm';
import { characters as CHARACTERS } from '../../../../common';

const allCharacters = ((characters) => {
  const chars = Object.assign({}, characters);
  Object.keys(chars).forEach((char) => {
    const defaultActive = ['MERLIN'].includes(char);
    chars[char].active = defaultActive;
  });
  return chars;
})(CHARACTERS);

function hydrateCharacterList(list, numberOfPlayers) {
  const selectedCharacters = list.slice(0);
  const maxCounts = {
    5: { good: 3, bad: 2 },
    6: { good: 4, bad: 2 },
    7: { good: 4, bad: 3 },
    8: { good: 5, bad: 3 },
    9: { good: 6, bad: 3 },
    10: { good: 6, bad: 4 },
  };
  const counts = maxCounts[numberOfPlayers];
  if (!counts) throw new Error('numberOfPlayers must be >=5 and <=10');

  const { good: maxGoodCount, bad: maxBadCount } = counts;
  const goodCount = selectedCharacters.filter(c => c.isGood).length;
  const goodToAddCount = maxGoodCount - goodCount;

  const badCount = selectedCharacters.filter(c => !c.isGood).length;
  const badToAddCount = maxBadCount - badCount;
  for (let i = 0; i < goodToAddCount; i += 1) {
    selectedCharacters.push(CHARACTERS.STANDARD_GOOD);
  }
  for (let i = 0; i < badToAddCount; i += 1) {
    const char = (i === 0) ? CHARACTERS.ASSASIN : CHARACTERS.STANDARD_EVIL;
    selectedCharacters.push(char);
  }

  return selectedCharacters;
}

class CreateRoom extends Component {
  static propTypes = {
    onCreateGame: PropTypes.func.isRequired,
  };

  state = {
    numberOfPlayers: 5,
    includedCharacters: allCharacters,
    playerName: '',
    attemptedSubmit: false,
  };

  handleInputChange = (e, args) => {
    const { name, value } = args;
    switch (name) {
    case 'numberOfPlayers':
    case 'playerName':
      this.setState({ [name]: value });
      break;
    default: {
      this.setState((({ includedCharacters }) => {
        const updatedincludedCharacters = Object.assign({}, includedCharacters);
        updatedincludedCharacters[name].active = !updatedincludedCharacters[name].active;
        return { includedCharacters: updatedincludedCharacters };
      }));
    }
    }
  };

  handleCreateGame = async () => {
    const { playerName, numberOfPlayers, includedCharacters } = this.state;
    this.setState({ attemptedSubmit: true });
    if (playerName.length) {
      const selectedCharacterList = Object.entries(includedCharacters)
        .map(([, val]) => val)
        .filter(({ active }) => active);

      const inflatedCharacterList = hydrateCharacterList(selectedCharacterList, numberOfPlayers);
      const config = {
        selectedCharacterIDs: inflatedCharacterList.map(({ id }) => id),
        playerName,
      };
      console.log(config);
      await this.props.onCreateGame(config);
    }
  };

  render() {
    return (
      <CreateRoomForm
        characters={this.state.includedCharacters}
        onToggleCharacter={this.handleInputChange}
        numberOfPlayers={this.state.numberOfPlayers}
        onNumberOfPlayersChange={this.handleInputChange}
        playerName={this.state.playerName}
        onPlayerNameChange={this.handleInputChange}
        hasAttemptedSubmit={this.state.attemptedSubmit}
        onCreateGame={this.handleCreateGame}
      />
    );
  }
}

export default CreateRoom;
