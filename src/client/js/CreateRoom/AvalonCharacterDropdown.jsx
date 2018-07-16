import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CHARACTERS } from '../../../config';

const options = Object.entries(CHARACTERS)
  .map(([key, val]) => ({ text: val, value: val }));

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
  defaultCharacterID: PropTypes.oneOf(Object.values(CHARACTERS)),
};

export default AvalonCharacterDropdown;
