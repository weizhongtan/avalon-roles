import React from 'react';
import { Form } from 'semantic-ui-react';

const options = [
  { text: 'Merlin', value: 0 },
  { text: 'Loyal servant of Arthur', value: 1 },
  { text: 'Minion of Mordred', value: 2 },
  { text: 'Assassin', value: 3 },
];

const AvalonCharacterSelect = ({ ...props }) => (
  <Form.Dropdown
    selection
    options={options}
    fluid
    {...props}
  />
);

export default AvalonCharacterSelect;
