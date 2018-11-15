import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Image, View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Button, Icon, List, ListItem, Input } from 'native-base';
import navigateTo from '@actions/sideBarNav';
import {
  attemptCredentialUser,
  setCredentialUser,
  setCredentialLoggedIn,
  setCredentialEmail,
  setCredentialToken,
  setForgotEmail,
  attemptForgotPassword,
  packsReset,
  logout,
} from '@actions/Creators';

import { Styles, Images, Metrics, Colors } from '@theme/';
import styles from './styles';

const {
  replaceAtIndex,
  popRoute,
} = actions;


class Account extends Component {  // eslint-disable-line
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
  componentWillMount() {
    this.props.attemptCredentialUser();
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

  promoCode() {
    this.props.onPromoCode();
  }

  loginOther() {
    Alert.alert('Are you sure you want to logout?', 'Logging out will remove all downloaded packs from this device. (You will be able to reload them.)', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: () => this.props.loginOther() },
    ]);
  }

  forgotPassword() {
    this.props.onForgotPassword();
  }

  renderButtons() {
    console.log(this.props);
    return (
        <View>
          {
            this.props.credential.is_logged_in ?
              <View style={[{ flexDirection: 'column', paddingBottom: Metrics.screenHeight * 0.05 }]}>
                  <TouchableOpacity
                      style={[Styles.center, styles.buttonAccount]}
                      onPress={() => this.loginOther()}
                  >
                      <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                          Logout
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[Styles.center, styles.buttonAccount]}
                      onPress={() => this.promoCode()}
                  >
                      <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                          New Organization Code
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[Styles.center, styles.buttonAccount]}
                      onPress={() => this.forgotPassword()}
                  >
                      <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                          Change Password
                      </Text>
                  </TouchableOpacity>
              </View>
              :
              <View style={[{ flexDirection: 'column', paddingBottom: Metrics.screenHeight * 0.05 }]}>
                  <TouchableOpacity
                      style={[Styles.center, styles.buttonAccount]}
                      onPress={() => this.props.login()}
                  >
                      <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                          Login
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[Styles.center, styles.buttonAccount]}
                      onPress={() => this.props.register()}
                  >
                      <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                          Register
                      </Text>
                  </TouchableOpacity>
              </View>
          }
        </View>
      );
  }
  hasPromoCode() {
    return this.props.credential.user.promo.code !== '';
  }
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
        <ScrollView>
          <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Account</Text>
          {
            this.props.credential.is_logged_in ?
              <List>
                  <ListItem style={styles.listItem}>
                      <View >
                          <Text style={styles.listItemTextTitle}>Email</Text>
                          <Text style={styles.listItemTextBody}>{this.props.credential.email}</Text>
                      </View>
                  </ListItem>
                  {this.hasPromoCode() && <View><ListItem style={styles.listItem}>
                      <View >
                          <Text style={styles.listItemTextTitle}>Organization Code</Text>
                          <Text style={styles.listItemTextBody}>{this.props.credential.user.promo.code}</Text>
                      </View>
                  </ListItem>
                      <ListItem style={styles.listItem}>
                          <View >
                              <Text style={styles.listItemTextTitle}>Org Code Expiration Date</Text>
                              <Text style={styles.listItemTextBody}>{this.props.credential.user.promo.expireAt}</Text>
                          </View>
                      </ListItem>
                      <ListItem style={styles.listItem}>
                          <View >
                              <Text style={styles.listItemTextTitle}>Organization</Text>
                              <Text style={styles.listItemTextBody}>{this.props.credential.user.promo.organization}</Text>
                          </View>
                      </ListItem>
                  </View>}
              </List>
              :
              <Text></Text>
          }
          {this.renderButtons()}
        </ScrollView>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    popRoute: key => dispatch(popRoute(key)),
    attemptCredentialUser: key => dispatch(attemptCredentialUser(key)),
    setUser: user => dispatch(setCredentialUser(user)),
    setForgotEmail: email => dispatch(setForgotEmail(email)),
    attemptForgotPassword: email => dispatch(attemptForgotPassword(email)),
    loginOther: () => {
      dispatch(setCredentialLoggedIn(false));
      dispatch(setCredentialToken(''));
      dispatch(setCredentialEmail(''));
      dispatch(packsReset());
      dispatch(logout());
      dispatch(replaceAtIndex(0, { key: 'login' }, 'global'));
    },
    login: () => {
      dispatch(replaceAtIndex(0, { key: 'login' }, 'global'));
    },
    register: () => {
      dispatch(replaceAtIndex(0, { key: 'register' }, 'global'));
    },
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  credential: state.credential,
});

export default connect(mapStateToProps, bindAction)(Account);
