
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Text, Button, View, InputGroup, Input } from 'native-base';

import {
  attemptForgotPassword,
  setForgotEmail,
} from '@actions/Creators';
import { Images, Metrics, Styles, Colors } from '@theme/';
import styles from './styles';

const Analytics = require('react-native-firebase-analytics');
let Fabric = require('react-native-fabric');
let { Crashlytics, Answers } = Fabric;

const {
  replaceAt,
} = actions;

const ForgotPassword = props => (
  <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandPrimary }]}>
    <View style={styles.headerView}>
      <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
    </View>
    <Image
      source={Images.launchScreen}
      resizeMode={'stretch'}
      style={{ flex: 1, width: null, height: null }}
    >
      <View style={{ flex: 1, margin: Metrics.doubleBaseMargin, padding: Metrics.doubleBaseMargin, backgroundColor: Colors.brandPrimary }}>
        <Text style={{ marginBottom: 20, fontSize: Metrics.screenWidth / 32, color: Colors.titleColor, padding: Metrics.doubleBaseMargin }}>
          Forgot Password
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Metrics.doubleBaseMargin }}>
          <View style={{ flex: 1, alignItems: 'flex-start', marginHorizontal: 5, padding: 5, borderColor: 'grey', borderBottomWidth: 1 }}>
            <TextInput
              style={{ height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.4, fontSize: Metrics.screenWidth / 35 }}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType={'email-address'}
              placeholder="Email"
              onChangeText={text => props.setForgotEmail(text)}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Metrics.doubleBaseMargin }}>
          <Button
            style={[Styles.buttonRadius, { width: Metrics.screenWidth / 6, margin: 15 }]}
            onPress={() => props.replaceAt('forgot-password', { key: 'login' }, 'global')}
          >
              <Text style={styles.loginButtonText}>Back to Login</Text>
          </Button>
          <Button
            style={[Styles.buttonRadius, { width: Metrics.screenWidth / 6, margin: 15 }]}
            onPress={() => props.attemptForgotPassword(props.email)}
          >
           <Text style={styles.loginButtonText}>Submit</Text>
          </Button>
        </View>
      </View>
    </Image>
  </View>
);

ForgotPassword.propTypes = {
  setAccountEmail: PropTypes.func,
  attemptSetPassword: PropTypes.func,
};


function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setForgotEmail: email => dispatch(setForgotEmail(email)),
    attemptForgotPassword: email => dispatch(attemptForgotPassword(email)),
    dispatch,
  };
}

function mapStateToProps(state) {
  const { attempting, error, email, done } = state.ForgotPasswordReducer;
  return { attempting, error, email, done };
}

export default connect(mapStateToProps, bindActions)(ForgotPassword);
