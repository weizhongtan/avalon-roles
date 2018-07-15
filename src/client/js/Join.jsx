import React from 'react';
import { Button, Form, Segment, Header } from 'semantic-ui-react';

class Join extends React.Component {
  state = {
    playerName: null,
    roomName: null,
    hasJoinedRoom: false,
    gameStarted: false,
    character: null,
    playerView: null,
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleJoinRoom = () => {
    this.setState({ hasJoinedRoom: true });
    this.props.onJoinRoom(this.state);
  };

  render() {
    return (
      <div>
        <Segment>
          {this.state.hasJoinedRoom ? (
            <div>
              <Header>{this.state.gameStarted ? `You are ${this.state.character}` : 'Waiting for players'}</Header>
              {this.state.playerView && (
                <ul>
                  {Object.entries(this.state.player).map(([player, view], index) => (
                    <li key={index}>{player} is {view}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Form>
              <Form.Input name='roomName' placeholder='Room ID' onChange={this.handleInputChange} />
              <Form.Input name='playerName' placeholder='Your Name' onChange={this.handleInputChange} />
              <Button positive fluid onClick={this.handleJoinRoom}>
              Join Game
              </Button>
            </Form>
          )}
        </Segment>
      </div>
    );
  }
}

export default Join;
