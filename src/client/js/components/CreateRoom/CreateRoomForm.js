import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Header, Button, Divider } from 'semantic-ui-react';

import CharacterToggle from './CharacterToggle';

const options = [
  { text: 5, value: 5 },
  { text: 6, value: 6 },
  { text: 7, value: 7 },
  { text: 8, value: 8 },
  { text: 9, value: 9 },
  { text: 10, value: 10 },
];

const CreateRoomForm = ({
  characters,
  numberOfPlayers,
  onPlayerNameChange,
  playerName,
  onToggleCharacter,
  onCreateGame,
  onNumberOfPlayersChange,
  hasAttemptedSubmit,
}) => {
  const ToggleableCharacters = (
    <Button.Group vertical fluid labeled icon>
      {Object.entries(characters).map(([char, { active, name, isGood }]) => (
        <CharacterToggle
          name={char}
          key={char}
          content={name}
          onToggle={onToggleCharacter}
          active={active}
          isGood={isGood}
        />
      ))}
    </Button.Group>
  );

  return (
    <Segment>
      <Form>
        <Form.Dropdown
          label="Number of players"
          selection
          name="numberOfPlayers"
          onChange={onNumberOfPlayersChange}
          options={options}
          value={numberOfPlayers}
        />
        <Header content="Select characters" size="tiny" />
        {ToggleableCharacters}
        <Divider />
        <Form.Input
          name="playerName"
          placeholder="Your Name"
          onChange={onPlayerNameChange}
          error={playerName === '' && hasAttemptedSubmit}
          value={playerName}
        />
        <Divider />
        <Button
          fluid
          positive
          content="Create and join room"
          onClick={onCreateGame}
        />
      </Form>
    </Segment>
  );
};

CreateRoomForm.propTypes = {
  characters: PropTypes.shape({}).isRequired,
  numberOfPlayers: PropTypes.number.isRequired,
  onPlayerNameChange: PropTypes.func.isRequired,
  playerName: PropTypes.string.isRequired,
  onToggleCharacter: PropTypes.func.isRequired,
  onCreateGame: PropTypes.func.isRequired,
  onNumberOfPlayersChange: PropTypes.func.isRequired,
  hasAttemptedSubmit: PropTypes.bool.isRequired,
};

export default CreateRoomForm;
