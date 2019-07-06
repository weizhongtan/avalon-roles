import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Segment } from 'semantic-ui-react';

import PlayView from './PlayView';

class JoinRoom extends React.Component {
  static propTypes = {
    playerName: PropTypes.string.isRequired,
    onJoinRoom: PropTypes.func.isRequired,
    onStartGame: PropTypes.func.isRequired,
    assignedCharacter: PropTypes.object,
    viewOfOtherPlayers: PropTypes.object,
    currentRoom: PropTypes.object,
  };

  state = {
    chosenRoomId: '',
    playerName: '',
    chosenRoomIdInvalid: false,
    playerNameInvalid: false,
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleJoinRoom = () => {
    this.setState({
      chosenRoomIdInvalid: !this.state.chosenRoomId.length,
      playerNameInvalid: !this.state.playerName.length,
    });
    if (!this.state.chosenRoomId.length || !this.state.playerName.length) {
      return;
    }
    this.props.onJoinRoom({
      playerName: this.state.playerName,
      roomId: this.state.chosenRoomId,
    });
  };

  render() {
    const PlayViewSection = (
      <PlayView
        playerName={this.props.playerName}
        assignedCharacter={this.props.assignedCharacter}
        viewOfOtherPlayers={this.props.viewOfOtherPlayers}
        currentRoom={this.props.currentRoom}
        onStartGame={this.props.onStartGame}
      />
    );
    const JoinRoomSection = (
      <Form>
        <Form.Input
          name='chosenRoomId'
          value={this.state.chosenRoomId}
          placeholder='Room Id'
          onChange={this.handleInputChange}
          error={this.state.chosenRoomIdInvalid}
        />
        <Form.Input
          name='playerName'
          value={this.state.playerName}
          placeholder='Your Name'
          onChange={this.handleInputChange}
          error={this.state.playerNameInvalid}
        />
        <Button positive fluid onClick={this.handleJoinRoom} content='Join Room' />
      </Form>
    );

    return (
      <div>
        <Segment>
          {this.props.currentRoom.roomId ? PlayViewSection : JoinRoomSection}
        </Segment>
      </div>
    );
  }
}

export default JoinRoom;
