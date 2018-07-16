import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const options = [
  { text: 'Merlin', value: 0 },
  { text: 'Loyal servant of Arthur', value: 1 },
  { text: 'Minion of Mordred', value: 2 },
  { text: 'Assassin', value: 3 },
];

const AvalonCharacterDropdown = ({ defaultCharacterID, ...props }) => (
  <Form.Dropdown
    selection
    options={options}
    fluid
    defaultValue={defaultCharacterID}
    {...props}
  />
);

AvalonCharacterDropdown.propTypes = {
  defaultCharacterID: PropTypes.number,
};

export default AvalonCharacterDropdown;
