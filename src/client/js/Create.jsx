import React from 'react';
import { Button, Form, Segment, Header } from 'semantic-ui-react';
import AvalonCharacterSelect from './AvalonCharacterSelect.jsx';

const options = [
  { text: 5, value: 5 },
  { text: 6, value: 6 },
  { text: 7, value: 7 },
  { text: 8, value: 8 },
  { text: 9, value: 9 },
  { text: 10, value: 10 },
];

class Create extends React.Component {
  state = {
    numberOfPlayers: 5,
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleCreateGame = () => this.props.onCreateGame(this.state);

  render() {
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
            {new Array(this.state.numberOfPlayers).fill(null).map((_, index) => {
              if (index === 0) {
                return <AvalonCharacterSelect key={index} defaultValue={0}/>;
              }
              if (index === 1) {
                return <AvalonCharacterSelect key={index} defaultValue={1}/>;
              }
              return <AvalonCharacterSelect key={index} />;
            })}
          </Segment>
          <Button positive fluid type='submit' onClick={this.handleCreateGame}>
          Create Game
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default Create;
