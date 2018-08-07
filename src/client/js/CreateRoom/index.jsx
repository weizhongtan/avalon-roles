import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Button, Divider } from 'semantic-ui-react';

import CharacterToggle from './CharacterToggle';
import { CHARACTERS } from '../../../config';

const options = [
  { text: 5, value: 5 },
  { text: 6, value: 6 },
  { text: 7, value: 7 },
  { text: 8, value: 8 },
  { text: 9, value: 9 },
  { text: 10, value: 10 },
];

const allCharacters = Object.assign({}, CHARACTERS);
Object.keys(allCharacters).forEach((char) => {
  const defaultActive = ['MERLIN'].includes(char);
  allCharacters[char].active = defaultActive;
});

class CreateRoom extends React.Component {
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
    this.setState({ attemptedSubmit: true });
    if (this.state.playerName.length) {
      const selectedCharacterIDs = Object.entries(this.state.includedCharacters)
        .map(([, val]) => val)
        .filter(({ active }) => active)
        .map(({ id }) => id);
      console.log(selectedCharacterIDs);
      const config = {
        selectedCharacterIDs,
        playerName: this.state.playerName,
      };
      await this.props.onCreateGame(config);
    }
  };

  render() {
    const dropdownList = (
      <Button.Group vertical fluid labeled icon>
        {Object.entries(this.state.includedCharacters)
          .map(([char, { active, name, isGood }]) => (
            <CharacterToggle
              name={char}
              key={char}
              content={name}
              onToggle={this.handleInputChange}
              active={active}
              isGood={isGood}
            />
          ))}
      </Button.Group>
    );

    return (
      <Segment>
        <Form>
          <Form.Dropdown
            label='Number of players'
            selection
            name='numberOfPlayers'
            onChange={this.handleInputChange}
            options={options}
            value={this.state.numberOfPlayers}
          />
          <Header content='Select characters' size='tiny' />
          {dropdownList}
          <Divider />
          <Form.Input
            name='playerName'
            placeholder='Your Name'
            onChange={this.handleInputChange}
            error={this.state.playerName === '' && this.state.attemptedSubmit}
            value={this.state.playerName}
          />
          <Divider />
          <Button
            fluid
            positive
            content='Create and join room'
            onClick={this.handleCreateGame}
          />
        </Form>
      </Segment>
    );
  }
}

export default CreateRoom;
