import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CreateRoomForm from './CreateRoomForm';
import { CHARACTERS } from '../../../config';

const allCharacters = Object.assign({}, CHARACTERS);
Object.keys(allCharacters).forEach((char) => {
  const defaultActive = ['MERLIN'].includes(char);
  allCharacters[char].active = defaultActive;
});

function inflateCharacterList(list, numberOfPlayers) {
  const selectedCharacters = list.slice(0);
  let maxGoodCount;
  let maxBadCount;
  switch (numberOfPlayers) {
  case 5: {
    maxGoodCount = 3;
    maxBadCount = 2;
    break;
  }
  case 6: {
    maxGoodCount = 4;
    maxBadCount = 2;
    break;
  }
  case 7: {
    maxGoodCount = 4;
    maxBadCount = 3;
    break;
  }
  case 8: {
    maxGoodCount = 5;
    maxBadCount = 3;
    break;
  }
  case 9: {
    maxGoodCount = 6;
    maxBadCount = 3;
    break;
  }
  case 10: {
    maxGoodCount = 6;
    maxBadCount = 4;
    break;
  }
  default:
    throw new Error('invalid number of players:', numberOfPlayers);
  }

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

class CreateRoomContainer extends Component {
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

      const inflatedCharacterList = inflateCharacterList(selectedCharacterList, numberOfPlayers);
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

export default CreateRoomContainer;
