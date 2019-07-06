import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Segment, Message } from 'semantic-ui-react';

import { errors } from '../../../../common';
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
    duplicatePlayerName: false,
  };

  handleInputChange = (e, { name, value }) => {
    const transformedValue = name === 'chosenRoomId'
      ? value.toUpperCase().trim().slice(0, 4)
      : value;
    this.setState({
      [name]: transformedValue,
      [`${name}Invalid`]: false
    });
  };

  handleJoinRoom = async () => {
    this.setState({
      chosenRoomIdInvalid: !this.state.chosenRoomId.length,
      playerNameInvalid: !this.state.playerName.length,
    });
    if (!this.state.chosenRoomId.length || !this.state.playerName.length) {
      return;
    }
    try {
      await this.props.onJoinRoom({
        playerName: this.state.playerName,
        roomId: this.state.chosenRoomId,
      });
    } catch (err) {
      if (err === errors.DUPLICATE_NAME) {
        this.setState({ duplicatePlayerName: true });
      }
    }
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
      <Form
      >
        {this.state.duplicatePlayerName && <Message negative>
          <Message.Header>Sorry, that name has been taken</Message.Header>
          <p>Try a different name</p>
        </Message>}
        <Form.Input
          autoFocus
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
          error={this.state.playerNameInvalid || this.state.duplicatePlayerName}
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
