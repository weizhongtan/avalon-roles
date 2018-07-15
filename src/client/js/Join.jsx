import React from 'react';
import { Button, Form } from 'semantic-ui-react';

const FormExampleForm = () => (
  <Form>
    <Form.Field>
      <label>First Name</label>
      <input placeholder='Room ID' />
    </Form.Field>
    <Form.Field>
      <label>Last Name</label>
      <input placeholder='Your Name' />
    </Form.Field>
    <Button type='submit'>Join</Button>
  </Form>
);

export default FormExampleForm;
