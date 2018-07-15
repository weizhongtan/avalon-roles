import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Icon, Segment } from 'semantic-ui-react';

const Home = () => (
  <Form>
    <Segment>
      <Button primary fluid as= {Link} to="/join">
        <Icon name='plus' />
        Join a game
      </Button>
      <Button secondary fluid as= {Link} to="/create">
        <Icon name='cog' />
        Create a game
      </Button>
    </Segment>
  </Form>
);

export default Home;
