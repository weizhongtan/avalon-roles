import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Icon, Segment } from 'semantic-ui-react';

const LinkButton = ({ text, iconName, linkTo }) => (
  <Button primary fluid as= {Link} to={linkTo}>
    <Icon name={iconName} />
    {text}
  </Button>
);

LinkButton.propTypes = {
  text: PropTypes.string,
  iconName: PropTypes.string,
  linkTo: PropTypes.string,
};

const Home = () => (
  <Form>
    <Segment>
      <LinkButton text='Join a game' iconName='plus' linkTo='/join' />
      <LinkButton text='Create a game' iconName='cog' linkTo='/create' />
    </Segment>
  </Form>
);

export default Home;
