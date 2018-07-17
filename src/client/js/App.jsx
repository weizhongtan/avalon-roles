import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import uuid from 'uuid/v4';

import Sidebar from './Sidebar';
import Home from './Home';
import JoinRoom from './JoinRoom';
import CreateRoom from './CreateRoom';

import { createChannel } from './lib';

class App extends React.Component {
  state = {
    socket: null,
    roomID: null,
    currentRoom: {
      roomID: null,
      members: [],
    },
    playerName: null,
    assignedCharacter: null,
    viewOfOtherPlayers: null,
  };

  componentDidMount = () => {
    this.socket = createChannel(new WebSocket(`wss://${window.location.hostname}`));
    this.socket.onMessage(({ payload }) => {
      console.log('got data', payload);
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

  handleCreateGame = async ({ selectedCharacterIDs }) => {
    const roomID = uuid().slice(0, 4).toUpperCase();
    this.setState({ roomID });
    await this.socket.createRoom({
      roomID,
      selectedCharacterIDs,
    });
  };

  handleJoinRoom = async ({ roomID, playerName }) => {
    this.setState({ roomID, playerName });
    await this.socket.joinRoom({
      roomID,
      playerName,
    });
  };

  render() {
    return (
      <HashRouter basename='/'>
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
      </HashRouter>
    );
  }
}

export default App;
