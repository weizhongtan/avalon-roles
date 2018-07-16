import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Segment } from 'semantic-ui-react';
import PlayView from './PlayView';

class Join extends React.Component {
  static propTypes = {
    onJoinRoom: PropTypes.func,
    assignedCharacter: PropTypes.object,
    viewOfOtherPlayers: PropTypes.object,
    currentRoom: PropTypes.object,
  };

  state = {
    chosenRoomID: '',
    playerName: '',
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleJoinRoom = () => {
    this.props.onJoinRoom({
      playerName: this.state.playerName,
      roomID: this.state.chosenRoomID,
    });
  };

  render() {
    return (
      <div>
        <Segment>
          {this.props.currentRoom.roomID ? (
            <PlayView
              assignedCharacter={this.props.assignedCharacter}
              viewOfOtherPlayers={this.props.viewOfOtherPlayers}
              currentRoom={this.props.currentRoom}
            />
          ) : (
            <Form>
              <Form.Input name='chosenRoomID' placeholder='Room ID' onChange={this.handleInputChange} />
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
