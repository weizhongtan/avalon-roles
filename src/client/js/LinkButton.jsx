import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

const LinkButton = ({ text, iconName, linkTo, ...rest }) => (
  <Button fluid as= {Link} to={linkTo} {...rest}>
    <Icon name={iconName} />
    {text}
  </Button>
);

LinkButton.propTypes = {
  text: PropTypes.string,
  iconName: PropTypes.string,
  linkTo: PropTypes.string,
};

export default LinkButton;
