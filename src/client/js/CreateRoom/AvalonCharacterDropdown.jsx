import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CHARACTERS } from '../../../config';

const options = [
  { text: CHARACTERS.MERLIN, value: CHARACTERS.MERLIN },
  { text: CHARACTERS.STANDARD_GOOD, value: CHARACTERS.STANDARD_GOOD },
  { text: CHARACTERS.STANDARD_EVIL, value: CHARACTERS.STANDARD_EVIL },
  { text: CHARACTERS.ASSASIN, value: CHARACTERS.ASSASIN },
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
  defaultCharacterID: PropTypes.oneOf(Object.values(CHARACTERS)),
};

export default AvalonCharacterDropdown;
