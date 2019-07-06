import React from 'react';
import { Segment, Button } from 'semantic-ui-react';

import LinkButton from './LinkButton/LinkButton';

const Home = () => (
  <Segment>
    <Button.Group labeled vertical icon fluid>
      <LinkButton text="Join a game" iconName="plus" linkTo="/join" primary />
      <LinkButton
        text="Create a game"
        iconName="cog"
        linkTo="/create"
        secondary
      />
    </Button.Group>
  </Segment>
);

export default Home;
