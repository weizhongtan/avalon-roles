import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

const Join = () => (
  <Segment>
    <Form>
      <Form.Input name='room-id' placeholder='Room ID' />
      <Form.Input name='player-name' placeholder='Your Name' />
      <Button positive fluid type='submit'>Join Game</Button>
    </Form>
  </Segment>
);

export default Join;
