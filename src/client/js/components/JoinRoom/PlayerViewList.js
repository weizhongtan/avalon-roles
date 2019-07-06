import React from 'react';
import PropTypes from 'prop-types';

const PlayerViewItem = ({ otherPlayer, viewedAs }) => (
  <li>
    {otherPlayer} is {viewedAs || 'unknown.'}
  </li>
);

PlayerViewItem.propTypes = {
  otherPlayer: PropTypes.string.isRequired,
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
  viewOfOtherPlayers: PropTypes.object.isRequired,
};

export default PlayerViewList;
