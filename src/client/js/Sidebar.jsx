import React, { Component } from 'react'
import { Button, Header, Icon, Image, Menu, Segment, Sidebar, Grid } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default class SlidingSidebar extends Component {
  state = { visible: false };

  handleButtonClick = () => this.setState({ visible: !this.state.visible });

  handleSidebarHide = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;

    return (
      <div style={{ height: '100vh' }}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='push'
            inverted
            onHide={this.handleSidebarHide}
            visible={visible}
            direction='top'
            widths={2}
          >
            <Menu.Item as={NavLink} to='/join' onClick={this.handleSidebarHide}>
              <Icon name='plus' />
              Join a game
            </Menu.Item>
            <Menu.Item as={NavLink} to='/create' onClick={this.handleSidebarHide}>
              <Icon name='cog' />
              Create a game
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <Button fluid onClick={this.handleButtonClick}>
              <Icon name='bars' />
            </Button>
            <Segment vertical>
              {this.props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
