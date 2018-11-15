
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, Content } from 'native-base';

import navigateTo from '../../actions/sideBarNav';
import theme from '../../themes/base-theme';
import styles from './style';


class SideBar extends Component {

  static propTypes = {
    navigateTo: PropTypes.func,
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Content theme={theme} style={{ backgroundColor: '#fff' }} >
        <Text style={[styles.name, { top: 120 }]}>John Doe </Text>
        <Text style={[styles.name, { top: 140 }]}>$ 500, Strap Sale Credit </Text>
        <Text style={{ color: '#000', fontSize: 16, margin: 20, fontWeight: '500', marginBottom: 10 }}>
            Shop by Category
        </Text>
      </Content>
    );
  }
}

function bindAction(dispatch) {
  return {
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(SideBar);
