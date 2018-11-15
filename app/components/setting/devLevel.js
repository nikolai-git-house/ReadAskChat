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


class DevLevel extends Component {  // eslint-disable-line
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
        <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Developmental Level</Text>
        <Text style={{ color: Colors.textSecondary, marginVertical: Metrics.doubleBaseMargin, fontSize: Metrics.screenWidth / 43 }}>
          Choose a level for conversation starters. You can change at any time.
        </Text>
        <TouchableOpacity onPress={() => this.setDevelopmentalLevel('baby')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.baseMargin }}>
          <RadioButton
              anmation={'bounceIn'}
              size={13}
              innerColor={'#999999'}
              outerColor={'#999999'}
              isSelected={this.props.developmentalLevel === 'baby'}
              onPress={() => this.setDevelopmentalLevel('baby')}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.babyColor, marginLeft: Metrics.baseMargin }}>
              Baby
            </Text>
            <Text style={{ fontSize: Metrics.screenWidth / 50, color: Colors.babyColor, marginLeft: Metrics.doubleBaseMargin }}>
              (6-18 months)
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setDevelopmentalLevel('toddler')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <RadioButton
              anmation={'bounceIn'}
              size={13}
              innerColor={'#999999'}
              outerColor={'#999999'}
              isSelected={this.props.developmentalLevel === 'toddler'}
              onPress={() => this.setDevelopmentalLevel('toddler')}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.toddlerColor, marginLeft: Metrics.baseMargin }}>
              Toddler
            </Text>
            <Text style={{ fontSize: Metrics.screenWidth / 50, color: Colors.toddlerColor, marginLeft: Metrics.doubleBaseMargin }}>
              (12-24 months)
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setDevelopmentalLevel('preschooler')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <RadioButton
              anmation={'bounceIn'}
              size={13}
              innerColor={'#999999'}
              outerColor={'#999999'}
              isSelected={this.props.developmentalLevel === 'preschooler'}
              onPress={() => this.setDevelopmentalLevel('preschooler')}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.preschoolerColor, marginLeft: Metrics.baseMargin }}>
              Preschooler
            </Text>
            <Text style={{ fontSize: Metrics.screenWidth / 50, color: Colors.preschoolerColor, marginLeft: Metrics.doubleBaseMargin }}>
              (2-4 years)
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
    setDevelopmentalLevel: level => dispatch(setPreference('developmentalLevel', level)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  developmentalLevel: state.preference.developmentalLevel,
});

export default connect(mapStateToProps, bindAction)(DevLevel);
