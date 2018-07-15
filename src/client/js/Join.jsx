import React from 'react';
import { Button, Form, Segment, Header } from 'semantic-ui-react';

class Join extends React.Component {
  state = {
    playerName: null,
    roomId: null,
    hasJoinedRoom: false,
    gameStarted: false,
    character: null,
    playerView: null,
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleJoinRoom = () => {
    this.setState({ hasJoinedRoom: true });
  };

  render() {
    return (
      <div>
        <Segment>
          {this.state.hasJoinedRoom ? (
            <div>
              <Header>{this.state.gameStarted ? `You are ${this.state.character}` : 'Waiting for players'}</Header>
              {typeof this.state.playerView === 'object' && (
                <ul>
                  {Object.entries(this.state.player).map(([player, view], index) => (
                    <li key={index}>{player} is {view}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Form>
              <Form.Input name='roomId' placeholder='Room ID' onChange={this.handleInputChange} />
              <Form.Input name='playerName' placeholder='Your Name' onChange={this.handleInputChange} />
              <Button positive fluid type='submit' onClick={this.handleJoinRoom}>
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
