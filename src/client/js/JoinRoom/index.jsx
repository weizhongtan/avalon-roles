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
    chosenRoomIDInvalid: false,
    playerNameInvalid: false,
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleJoinRoom = () => {
    this.setState({ chosenRoomIDInvalid: !this.state.chosenRoomID.length });
    this.setState({ playerNameInvalid: !this.state.playerName.length });
    if (!this.state.chosenRoomID.length || !this.state.playerName.length) {
      return;
    }
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
              <Form.Input name='chosenRoomID' placeholder='Room ID' onChange={this.handleInputChange} error={this.state.chosenRoomIDInvalid} />
              <Form.Input name='playerName' placeholder='Your Name' onChange={this.handleInputChange} error={this.state.playerNameInvalid} />
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
