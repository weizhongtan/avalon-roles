import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { CHARACTERS } from '../../../config';

const options = Object.entries(CHARACTERS)
  .map(([, { id, name }]) => ({ text: name, value: id }));

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
