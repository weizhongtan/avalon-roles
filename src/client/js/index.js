import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, withRouter } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'regenerator-runtime/runtime';

import App from './components/App';

const AppWithRouter = withRouter(App);

ReactDOM.render(((
  <HashRouter>
    <AppWithRouter />
  </HashRouter>
)), document.getElementById('root'));
