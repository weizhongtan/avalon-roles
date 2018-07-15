import React, { Component } from 'react'
import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';

export default class SlidingSidebar extends Component {
  state = { visible: false };

  handleButtonClick = () => this.setState({ visible: !this.state.visible });

  handleSidebarHide = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;

    return (
      <div>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="push"
            icon="labeled"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={visible}
            width="thin"
          >
            <Menu.Item as={NavLink} to="/join" onClick={this.handleSidebarHide}>
              <Icon name="plus" />
              Join a game
            </Menu.Item>
            <Menu.Item as={NavLink} to="/create" onClick={this.handleSidebarHide}>
              <Icon name="cog" />
              Create a game
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <Button onClick={this.handleButtonClick}>
              <Icon name="bars" />
            </Button>
            <Segment padded>
              {this.props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
