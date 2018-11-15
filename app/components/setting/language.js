import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { Icon, List, ListItem, Radio } from 'native-base';
import navigateTo from '@actions/sideBarNav';
import { setPreference } from '@actions/Creators';
import { Styles, Images, Metrics, Colors } from '@theme/';
import { LANGUAGES } from '@src/Constants';
import RadioButton from 'react-native-radio-button';

const {
  replaceAt,
  popRoute,
} = actions;


class Language extends Component {  // eslint-disable-line
  static propTypes = {
    popRoute: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
    replaceAt: PropTypes.func,
    navigateTo: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
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
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin  }}>
        <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Language Preference for Conversation Starters</Text>
        <List>
          {Object.keys(LANGUAGES).map((language, key) =>
            <TouchableOpacity key={key} onPress={() => this.props.setLanguage(language)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.baseMargin }}>
              <RadioButton
                  anmation={'bounceIn'}
                  size={13}
                  innerColor={'#999999'}
                  outerColor={'#999999'}
                  isSelected={language === this.props.language}
                  onPress={() => this.props.setLanguage(language)}
              />
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.textSecondary, marginLeft: Metrics.baseMargin }}>
                  {LANGUAGES[language]}
                </Text>
              </View>
            </TouchableOpacity>
            )}
        </List>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    popRoute: key => dispatch(popRoute(key)),
    setLanguage: language => dispatch(setPreference('language', language)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  language: state.preference.language,
});

export default connect(mapStateToProps, bindAction)(Language);
