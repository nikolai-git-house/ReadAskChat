
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Text, Button, View, InputGroup, Input } from 'native-base';

import {
  attemptSetPassword,
  setAccountEmail,
  setAccountPassword,
} from '@actions/Creators';
import { Images, Metrics, Colors, Styles } from '@theme/';
import styles from './styles';

const Analytics = require('react-native-firebase-analytics');
let Fabric = require('react-native-fabric');
let { Crashlytics, Answers } = Fabric;

const {
  replaceAt,
} = actions;

const ForgotPassword = props => (
  <View>
    <View style={styles.headerView}>
      <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
    </View>
    <ImageBackground
      source={Images.launchScreen}
      resizeMode={'stretch'}
      style={{ flex: 1, width: null, height: null }}
    >
      <View style={{ flex: 1, margin: Metrics.doubleBaseMargin, backgroundColor: Colors.greyColor }}>
        <Text style={{ fontSize: Metrics.screenWidth / 32, color: Colors.titleColor, padding: Metrics.doubleBaseMargin }}>
          Set Password
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Metrics.doubleBaseMargin }}>
          <View style={{ flex: 1, alignItems: 'flex-start', marginRight: 5 }}>
            <InputGroup borderType="underline" >
              <Input autoCapitalize="none" placeholder="Email" onChangeText={text => props.setAccountEmail(text)} style={{ fontSize: Metrics.screenWidth / 50 }} />
            </InputGroup>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-start', marginRight: 5 }}>
            <InputGroup borderType="underline" >
              <Input secureTextEntry autoCapitalize="none" placeholder="Password" onChangeText={text => props.setAccountEmail(text)} style={{ fontSize: Metrics.screenWidth / 50 }} />
            </InputGroup>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Metrics.doubleBaseMargin }}>
          <Button
            style={[Styles.buttonRadius, { width: Metrics.screenWidth / 6 }]}
            onPress={() => props.attemptSetPassword(props.email)}
          >
            <Text style={styles.loginButtonText}>Register</Text>
          </Button>
        </View>
      </View>
    </ImageBackground>
  </View>
);

ForgotPassword.propTypes = {
  setAccountEmail: PropTypes.func,
  attemptSetPassword: PropTypes.func,
};


function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setAccountEmail: email => dispatch(setAccountEmail(email)),
    setAccountPassword: password => dispatch(setAccountPassword(password)),
    attemptSetPassword: (email, password) => dispatch(attemptSetPassword(email, password)),
    dispatch,
  };
}

function mapStateToProps(state) {
  const { attempting, error, email, done } = state.ForgotPasswordReducer;
  return { attempting, error, email, done };
}

export default connect(mapStateToProps, bindActions)(ForgotPassword);
