import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router-dom';

import LinkButton from './LinkButton';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <StaticRouter>
        <LinkButton text="click me" iconName="cog" linkTo="/some-link" />
      </StaticRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
