import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import uuid from 'uuid/v4';
import 'semantic-ui-css/semantic.min.css';

import Sidebar from './Sidebar';
import Home from './Home';
import JoinRoom from './JoinRoom';
import CreateRoom from './CreateRoom';

import { createChannel } from './lib';

class App extends Component {
  static propTypes = {
    history: PropTypes.object,
  };

  state = {
    socket: null,
    roomID: null,
    currentRoom: {
      roomID: null,
      selectedCharacterIDs: [],
      members: [],
    },
    playerName: null,
    assignedCharacter: null,
    viewOfOtherPlayers: null,
  };

  componentDidMount = () => {
    this.socket = createChannel();
    this.socket.onMessage(({ payload }) => {
      console.log('got message', payload);
      const { currentRoom, assignedCharacter, playerView } = payload;
      if (currentRoom) {
        this.setState({ currentRoom });
      }
      if (assignedCharacter) {
        this.setState({ assignedCharacter });
      }
      if (playerView) {
        this.setState({ viewOfOtherPlayers: playerView });
      }
    });
  };

  handleCreateGame = async ({ selectedCharacterIDs, playerName }) => {
    const roomID = uuid().slice(0, 4).toUpperCase();
    const res1 = await this.socket.createRoom({
      roomID,
      selectedCharacterIDs,
    });
    if (res1.roomID && res1.selectedCharacterIDs) {
      await this.handleJoinRoom({ roomID, playerName });
    }
  };

  handleJoinRoom = async ({ roomID, playerName }) => {
    const res = await this.socket.joinRoom({
      roomID,
      playerName,
    });
    this.setState({
      roomID: res.roomID,
      playerName: res.playerName,
    });
    this.props.history.push('/join');
  };

  render() {
    return (
      <Sidebar>
        <Route exact path="/" component={Home}/>
        <Route exact path="/join" render={() => (
          <JoinRoom
            onJoinRoom={this.handleJoinRoom}
            currentRoom={this.state.currentRoom}
            assignedCharacter={this.state.assignedCharacter}
            viewOfOtherPlayers={this.state.viewOfOtherPlayers}
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
