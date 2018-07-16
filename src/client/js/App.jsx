import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import uuid from 'uuid/v4';

import Sidebar from './Sidebar';
import Home from './Home';
import JoinRoom from './JoinRoom';
import CreateRoom from './CreateRoom';

import TYPES from '../../config';
import { createChannel } from './lib';

class App extends React.Component {
  state = {
    socket: null,
    roomID: null,
    playerName: null,
    assignedCharacter: null,
    viewOfOtherPlayers: null,
  };

  componentDidMount = () => {
    this.socket = createChannel(new WebSocket('ws://localhost:8000'));
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
