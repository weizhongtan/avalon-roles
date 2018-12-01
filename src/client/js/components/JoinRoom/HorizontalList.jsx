import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react';

import { getRandomIcon } from '../../lib';

const HorizontalList = ({ elements }) => (
  <List horizontal relaxed>
    {elements.map((el, index) => (
      <List.Item key={index}>
        <Icon name={getRandomIcon()} />
        <List.Content>
          <List.Header>{el}</List.Header>
        </List.Content>
      </List.Item>
    ))}
  </List>
);

HorizontalList.propTypes = {
  elements: PropTypes.array.isRequired,
};

export default HorizontalList;
