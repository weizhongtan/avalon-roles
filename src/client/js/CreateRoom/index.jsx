import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Button } from 'semantic-ui-react';

import AvalonCharacterDropdown from './AvalonCharacterDropdown';
import { CHARACTERS } from '../../../config';

const options = [
  { text: 5, value: 5 },
  { text: 6, value: 6 },
  { text: 7, value: 7 },
  { text: 8, value: 8 },
  { text: 9, value: 9 },
  { text: 10, value: 10 },
];

const defaultCharacterIDs = [
  CHARACTERS.MERLIN.id,
  CHARACTERS.STANDARD_GOOD.id,
  CHARACTERS.STANDARD_GOOD.id,
  CHARACTERS.ASSASIN.id,
  CHARACTERS.STANDARD_EVIL.id,
];

class CreateRoom extends React.Component {
  static propTypes = {
    onCreateGame: PropTypes.func.isRequired,
  };

  state = {
    numberOfPlayers: 5,
    selectedCharacterIDs: defaultCharacterIDs,
    playerName: '',
    attemptedSubmit: false,
  };

  handleInputChange = (e, args) => {
    const { name, value, position } = args;
    switch (name) {
    case 'numberOfPlayers':
    case 'playerName':
      this.setState({ [name]: value });
      break;
    case 'characterDropdown':
      this.setState((({ selectedCharacterIDs }) => {
        const updatedIDs = [...selectedCharacterIDs];
        updatedIDs[position] = value;
        return { selectedCharacterIDs: updatedIDs };
      }));
      break;
    default:
      throw new Error(`invalid field name: ${name}`);
    }
  };

  handleCreateGame = async () => {
    this.setState({ attemptedSubmit: true });
    if (this.state.playerName.length) {
      await this.props.onCreateGame(this.state);
    }
  };

  render() {
    const dropdownList = new Array(this.state.numberOfPlayers)
      .fill(null)
      .map((_, index) => (
        <AvalonCharacterDropdown
          name='characterDropdown'
          key={index}
          position={index}
          defaultCharacterID={defaultCharacterIDs[index]}
          onChange={this.handleInputChange}
        />
      ));

    return (
      <Segment>
        <Form>
          <Form.Dropdown
            label='Number of players'
            selection
            name='numberOfPlayers'
            onChange={this.handleInputChange}
            options={options}
            defaultValue={this.state.numberOfPlayers}
            fluid
          />
          <Header content='Characters' size='tiny' />
          {dropdownList}
          <Form.Input
            name='playerName'
            placeholder='Your Name'
            onChange={this.handleInputChange}
            error={this.state.playerName === '' && this.state.attemptedSubmit}
          />
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
