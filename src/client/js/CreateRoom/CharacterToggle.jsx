import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { getRandomIcon } from '../lib';

const CharacterToggle = ({ onToggle, ...props }) => (
  <Button
    toggle
    icon={getRandomIcon()}
    onClick={onToggle}
    {...props}
  />
);

CharacterToggle.propTypes = {
  onToggle: PropTypes.func.isRequired,
};

export default CharacterToggle;
