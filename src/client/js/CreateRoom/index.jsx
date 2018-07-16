import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Segment, Header } from 'semantic-ui-react';
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
  CHARACTERS.MERLIN,
  CHARACTERS.STANDARD_GOOD,
  CHARACTERS.STANDARD_GOOD,
  CHARACTERS.ASSASIN,
  CHARACTERS.STANDARD_EVIL,
];

class CreateRoom extends React.Component {
  static propTypes = {
    onCreateGame: PropTypes.func.isRequired,
  };

  state = {
    numberOfPlayers: 5,
    selectedCharacterIDs: defaultCharacterIDs,
  };

  handleInputChange = (e, args) => {
    const { name, value, position } = args;
    console.log('got', args);
    if (name === 'numberOfPlayers') {
      this.setState({ [name]: value });
    } else if (name === 'characterDropdown') {
      this.setState((({ selectedCharacterIDs }) => {
        const updatedIDs = [...selectedCharacterIDs];
        updatedIDs[position] = value;
        return { selectedCharacterIDs: updatedIDs };
      }));
    }
  };

  handleCreateGame = () => this.props.onCreateGame(this.state);

  render() {
    const dropdownList = new Array(this.state.numberOfPlayers)
      .fill(null)
      .map((_, index) => {
        return (
          <AvalonCharacterDropdown
            name='characterDropdown'
            key={index}
            position={index}
            defaultCharacterID={defaultCharacterIDs[index]}
            onChange={this.handleInputChange}
          />
        );
      });

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
          <Segment>
            <Header content='Characters' size='tiny' />
            {dropdownList}
          </Segment>
          <Button positive fluid type='submit' onClick={this.handleCreateGame}>
          Create Game
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default CreateRoom;
