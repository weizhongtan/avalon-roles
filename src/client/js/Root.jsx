import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Segment } from 'semantic-ui-react';
import uuid from 'uuid/v4';

import Sidebar from './Sidebar.jsx';
import Home from './Home.jsx';
import Join from './Join.jsx';
import Create from './Create.jsx';

import TYPES from '../../config';
import { createChannel } from './lib.jsx';

// socketChannel.onMessage((data) => {
//     console.log('got message', data);
    // if (data.type === TYPES.UPDATE_ROOMS) {
    //     DOM.info.currentRoom.innerHTML = data.payload.roomName;
    //     DOM.info.currentMembers.innerHTML = '';
    //     data.payload.members.forEach((member) => {
    //         DOM.info.currentMembers.innerHTML += `<li>${member}</li>`;
    //     });
    // } else if (data.type === TYPES.UPDATE_PLAYER) {
    //     if (data.payload.name) {
    //         DOM.info.playerName.innerHTML = data.payload.name;
    //     }
    //     if (data.payload.playerView) {
    //         let str = '';
    //         console.log(data.payload.playerView);
    //         Object.entries(data.payload.playerView).forEach((player, view) => {
    //             str += `<li>${player}: is ${view || 'unknown'}</li>`;
    //         });
    //         DOM.info.playerView.innerHTML = str;
    //     }
    // }
// });

const socket = new WebSocket('ws://localhost:8000');
const socketChannel = createChannel(socket);

export function withChannel(WrappedComponent, selectChannel) {
  return class Wrapped extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectChannel(socketChannel, this.props),
      };
    }

    render() {
      return (
        <WrappedComponent data={this.state.data} {...this.props} />
      );
    }
  };
}

const WrappedCreate = withChannel(
  Create,
  (channel, props) => channel.onMessage(props.onData),
);

export default class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  onCreateGame = async ({ numberOfPlayers }) => {
    const roomId = uuid().slice(0, 4).toUpperCase();
    await socketChannel.createRoom({
      roomId,
      numberOfPlayers,
    });
  };

  onData = (data) => {
    console.log(data);
  };

  render() {
    return (
      <HashRouter basename='/'>
        <Sidebar>
          <Route exact path="/" component={Home}/>
          <Route exact path="/join" component={Join}/>
          <Route exact path="/create" render={() => (
            <WrappedCreate
              onCreateGame={this.onCreateGame}
              onData={this.onData}
            />
          )}/>
        </Sidebar>
      </HashRouter>
    );
  }
}
