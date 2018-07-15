import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {Button, Form, Segment} from 'semantic-ui-react';

const Home = () => (
  <Form>
    <Segment>
      <Button primary fluid as= {Link} to="/join">
      Join a game
      </Button>
    </Segment>
    <Segment>
      <Button secondary fluid as= {Link} to="/create">
      Create a game
      </Button>
    </Segment>
  </Form>
);

export default Home;
