import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, withRouter } from 'react-router-dom';

import App from './components/App';

const AppWithRouter = withRouter(App);

ReactDOM.render(
  <HashRouter>
    <AppWithRouter />
  </HashRouter>,
  document.getElementById('root')
);
