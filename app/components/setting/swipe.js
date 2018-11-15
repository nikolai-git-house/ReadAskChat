import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { View, Text, TouchableOpacity } from 'react-native';
import RadioButton from 'react-native-radio-button';

import navigateTo from '@actions/sideBarNav';
import { setPreference } from '@actions/Creators';

import { Styles, Metrics, Colors } from '@theme/';
import styles from './styles';

const {
  replaceAt,
  popRoute,
} = actions;


class Swipe extends Component {  // eslint-disable-line
  static propTypes = {
    popRoute: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
    replaceAt: PropTypes.func,
    navigateTo: PropTypes.func,
  }
  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }
  replaceRoute(route) {
    this.props.replaceAt('home', { key: route }, 'global');
  }
  navigateTo(route) {
    this.props.navigateTo(route, 'showPage');
  }
  setDevelopmentalLevel(level) {
    this.props.setDevelopmentalLevel(level);
  }
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
        <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Page Turns</Text>
        <Text style={{ color: Colors.textSecondary, marginVertical: Metrics.doubleBaseMargin, fontSize: Metrics.screenWidth / 43 }}>
          Consider locking the page-swipe feature if little hands turn pages before you are ready!
        </Text>
        <TouchableOpacity onPress={() => this.props.setSwipeEnabled(true)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.baseMargin }}>
            <RadioButton
                anmation={'bounceIn'}
                size={13}
                innerColor={'#999999'}
                outerColor={'#999999'}
                isSelected={this.props.swipeEnabled}
                onPress={() => this.props.setSwipeEnabled(true)}
            />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.textSecondary, marginLeft: Metrics.baseMargin }}>
              Enable page swiping
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.setSwipeEnabled(false)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <RadioButton
                anmation={'bounceIn'}
                size={13}
                innerColor={'#999999'}
                outerColor={'#999999'}
                isSelected={!this.props.swipeEnabled}
                onPress={() => this.props.setSwipeEnabled(false)}
            />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.textSecondary, marginLeft: Metrics.baseMargin }}>
              Lock page swiping
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    popRoute: key => dispatch(popRoute(key)),
    setSwipeEnabled: isEnabled => dispatch(setPreference('swipeEnabled', isEnabled)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  swipeEnabled: state.preference.swipeEnabled,
});

export default connect(mapStateToProps, bindAction)(Swipe);
