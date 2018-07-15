import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Segment } from 'semantic-ui-react';

import Sidebar from './Sidebar.jsx';
import Home from './Home.jsx';
import Join from './Join.jsx';

export default class Root extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
  }
  render() {
    return (
      <HashRouter basename='/'>
        <Sidebar>
          <Route exact path="/" component={Home}/>
          <Route exact path="/join" component={Join}/>
        </Sidebar>
      </HashRouter>
    );
  }
}
