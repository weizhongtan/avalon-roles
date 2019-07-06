import React, { Component } from 'react';
import { Button, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

class SlidingSidebar extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element),
  };

  state = { visible: false };

  handleButtonClick = () => this.setState({ visible: !this.state.visible });

  handleSidebarHide = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;

    return (
      <div style={{ height: '100%' }}>
        <Sidebar.Pushable as={Segment} style={{ overflow: 'hidden' }}>
          <Sidebar
            as={Menu}
            animation="push"
            inverted
            onHide={this.handleSidebarHide}
            visible={visible}
            direction="top"
            widths={2}
          >
            <Menu.Item as={NavLink} to="/join" onClick={this.handleSidebarHide}>
              <Icon name="plus" />
              Join a game
            </Menu.Item>
            <Menu.Item
              as={NavLink}
              to="/create"
              onClick={this.handleSidebarHide}
            >
              <Icon name="cog" />
              Create a game
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <Button
              icon="bars"
              fluid
              attached="bottom"
              onClick={this.handleButtonClick}
            />
            <Segment vertical>{this.props.children}</Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default SlidingSidebar;
