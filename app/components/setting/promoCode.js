import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import navigateTo from '@actions/sideBarNav';

import { Styles, Metrics, Colors } from '@theme/';
import styles from './styles';

const {
  replaceAt,
  popRoute,
} = actions;


class PromoCode extends Component {
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
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
        <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>
          Promo Code
        </Text>
        <Text style={{ color: Colors.textSecondary, marginVertical: Metrics.doubleBaseMargin, fontSize: Metrics.screenWidth / 43 }}>
          Lorem ipsum dolor elysium elit lorem elit dolor elysium elit lorem ipsum dolor
        </Text>
        <View style={{ borderBottomWidth: 1 }}>
          <TextInput placeholder={'Enter Promo Code'} style={{ fontSize: Metrics.screenWidth / 43, height: Metrics.screenWidth / 15, color: 'blue', fontWeight: 'bold' }} />
        </View>
        <View style={[Styles.right, { flexDirection: 'row' }]}>
          <TouchableOpacity
            style={[Styles.center, styles.buttonStyle]}
            onPress={() => alert('SUBMIT')}
          >
            <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
              SUBMIT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(PromoCode);
