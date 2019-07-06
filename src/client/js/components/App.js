import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Sidebar from './Sidebar';
import Home from './Home';
import JoinRoom from './JoinRoom/JoinRoom';
import CreateRoom from './CreateRoom/CreateRoom';

import { createChannel } from '../lib';
import { errors } from '../../../common';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  state = {
    roomId: null,
    currentRoom: {
      roomId: null,
      selectedCharacterIds: [],
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

  handleCreateGame = async ({ selectedCharacterIds, playerName }) => {
    const { roomId } = await this.channel.createRoom({
      selectedCharacterIds,
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
    const { members, selectedCharacterIds } = this.state.currentRoom;
    const activeMembers = members.filter(p => p.isActive);
    // if (activeMembers.length >= selectedCharacterIds.length) {
    await this.channel.startGame();
    // } else {
    //   throw new Error(errors.NOT_ENOUGH_PLAYERS);
    // }
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
