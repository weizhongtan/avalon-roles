import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { getRandomIcon } from '../lib';

const CharacterToggle = ({ onToggle, isGood, active, ...props }) => {
  return (
    <Button
      basic={!active}
      color={isGood ? 'green' : 'red'}
      icon={getRandomIcon()}
      onClick={onToggle}
      {...props}
    />
  );
};

CharacterToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isGood: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
};

export default CharacterToggle;
