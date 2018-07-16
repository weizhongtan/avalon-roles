import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PlayView from './PlayView';

class Join extends React.Component {
  static propTypes = {
    onJoinRoom: PropTypes.func,
    assignedCharacter: PropTypes.string,
    viewOfOtherPlayers: PropTypes.array,
  };

  state = {
    roomID: '',
    playerName: '',
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleJoinRoom = () => {
    this.props.onJoinRoom(this.state);
  };

  render() {
    return (
      <div>
        <Segment>
          {this.state.hasJoinedRoom ? (
            <PlayView
              assignedCharacter={this.props.assignedCharacter}
              viewOfOtherPlayers={this.props.viewOfOtherPlayers}
            />
          ) : (
            <Form>
              <Form.Input name='roomID' placeholder='Room ID' onChange={this.handleInputChange} />
              <Form.Input name='playerName' placeholder='Your Name' onChange={this.handleInputChange} />
              <Button positive fluid onClick={this.handleJoinRoom}>
              Join Room
              </Button>
            </Form>
          )}
        </Segment>
      </div>
    );
  }
}

export default Join;
