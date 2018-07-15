import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Sidebar from './Sidebar.jsx';
import Home from './Home.jsx';
import Join from './Join.jsx';

export default class Root extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);
    }
    render() {
        return (
            <Router>
                <div>
                    <Sidebar>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/join" component={Join}/>
                    </Sidebar>
                </div>
            </Router>
        );
    }
}
