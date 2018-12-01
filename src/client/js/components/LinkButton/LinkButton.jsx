import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const LinkButton = ({ text, iconName, linkTo, ...rest }) => (
  <Button
    fluid
    icon={iconName}
    as={Link}
    to={linkTo}
    content={text}
    {...rest}
  />
);

LinkButton.propTypes = {
  text: PropTypes.string,
  iconName: PropTypes.string,
  linkTo: PropTypes.string,
};

export default LinkButton;
