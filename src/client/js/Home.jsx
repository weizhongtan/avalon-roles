import React from 'react';
import { Form, Segment } from 'semantic-ui-react';
import LinkButton from './LinkButton';

const Home = () => (
  <Form>
    <Segment>
      <LinkButton text='Join a game' iconName='plus' linkTo='/join' primary />
      <LinkButton text='Create a game' iconName='cog' linkTo='/create' secondary />
    </Segment>
  </Form>
);

export default Home;
