import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Sidebar from './Sidebar';
import Home from './Home';
import JoinRoom from './JoinRoom/JoinRoom';
import CreateRoom from './CreateRoom/CreateRoom';

import { createChannel } from '../lib';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  state = {
    roomId: null,
    currentRoom: {
      roomId: null,
      selectedCharacterIDs: [],
      members: [],
    },
    playerName: '',
    assignedCharacter: null,
    viewOfOtherPlayers: null,
  };

  componentDidMount = () => {
    this.channel = createChannel();
    this.channel.onNotification(payload => {
      this.setState(payload);
    });
  };

  handleCreateGame = async ({ selectedCharacterIDs, playerName }) => {
    const { roomId } = await this.channel.createRoom({
      selectedCharacterIDs,
    });
    await this.handleJoinRoom({ roomId, playerName });
  };

  handleJoinRoom = async ({ roomId, playerName }) => {
    await this.channel.joinRoom({
      roomId,
      playerName,
    });
    this.props.history.push('/join');
  };

  handleStartGame = async () => {
    await this.channel.startGame();
  };

  render() {
    return (
      <Sidebar>
        <Route exact path="/" component={Home}/>
        <Route exact path="/join" render={() => (
          <JoinRoom
            playerName={this.state.playerName}
            onJoinRoom={this.handleJoinRoom}
            currentRoom={this.state.currentRoom}
            assignedCharacter={this.state.assignedCharacter}
            viewOfOtherPlayers={this.state.viewOfOtherPlayers}
            onStartGame={this.handleStartGame}
          />
        )} />
        <Route exact path="/create" render={() => (
          <CreateRoom
            onCreateGame={this.handleCreateGame}
          />
        )}/>
      </Sidebar>
    );
  }
}

export default App;
