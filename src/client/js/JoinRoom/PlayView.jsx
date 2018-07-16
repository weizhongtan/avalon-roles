import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const PlayerViewItem = ({ otherPlayer, viewedAs }) => (
  <li>{otherPlayer} is {viewedAs}</li>
);

PlayerViewItem.propTypes = {
  otherPlayer: PropTypes.string,
  viewedAs: PropTypes.string,
};

const PlayerViewList = ({ viewOfOtherPlayers }) => {
  const views = Object.entries(viewOfOtherPlayers);

  return (
    <ul>
      {views.map(([player, view]) => (
        <PlayerViewItem key={player} otherPlayer={player} viewedAs={view} />
      ))}
    </ul>
  );
};

PlayerViewList.propTypes = {
  viewOfOtherPlayers: PropTypes.array,
};

class PlayView extends Component {
  propTypes = {
    assignedCharacter: PropTypes.string,
    viewOfOtherPlayers: PropTypes.object,
  };

  render() {
    const { assignedCharacter, viewOfOtherPlayers } = this.props;
    return (
      <div>
        <Segment>
          <Header>
            {assignedCharacter ? `You are ${assignedCharacter}` : 'Waiting for players'}
          </Header>
        </Segment>
        <Segment>
          {viewOfOtherPlayers && <PlayerViewList />}
        </Segment>
      </div>
    );
  }
}

export default PlayView;
