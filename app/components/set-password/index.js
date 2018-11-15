
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Text, View, TextInput, TouchableOpacity,ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Button } from 'native-base';

import {
  attemptSetPassword,
  setAccountPassword,
  clearSetPassword,
} from '@actions/Creators';
import { Images, Metrics, Styles, Colors } from '@theme/';
import styles from './styles';

const {
  replaceAt,
} = actions;

const ForgotPassword = props => (
 
  <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandPrimary }]}>
    <View style={styles.headerView}>
      <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
    </View>
    <ImageBackground
      source={Images.launchScreen}
      resizeMode={'stretch'}
      style={{ flex: 1, width: null, height: null }}
    >
      <View style={{ flex: 1, margin: Metrics.doubleBaseMargin, padding: Metrics.doubleBaseMargin, backgroundColor: Colors.brandPrimary }}>
        <Text style={{ fontSize: Metrics.screenWidth / 32, color: Colors.titleColor, padding: Metrics.doubleBaseMargin }}>
          Set Password
        </Text>
        {props.done && <View style={{ padding: 10, backgroundColor: '#A5D6A7' }}>
          <Text style={{ fontSize: Metrics.screenWidth / 32, color: Colors.titleColor, padding: Metrics.doubleBaseMargin }}>
            {props.user.message}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Metrics.doubleBaseMargin }}>
            <Button
              large
              style={[Styles.buttonRadius, { width: Metrics.screenWidth / 6 }]}
              textStyle={styles.loginButtonText}
              onPress={() => props.login()}
            >
              <Text>Login</Text>
            </Button>
          </View>
        </View>}
        {props.done || <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Metrics.doubleBaseMargin }}>
            <View style={{ flex: 1, alignItems: 'flex-start', marginHorizontal: 5, padding: 5, borderColor: 'grey', borderBottomWidth: 1 }}>
              <TextInput
                style={{ height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.4, fontSize: Metrics.screenWidth / 35 }}
                underlineColorAndroid="transparent"
                editable={false}
                autoCapitalize="none"
                placeholder="Email"
                value={props.email}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start', marginHorizontal: 5, padding: 5, borderColor: 'grey', borderBottomWidth: 1 }}>
              <TextInput
                style={{ height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.4, fontSize: Metrics.screenWidth / 35 }}
                underlineColorAndroid="transparent"
                secureTextEntry
                autoCapitalize="none"
                placeholder="Password"
                onChangeText={text => props.setAccountPassword(text)}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Metrics.doubleBaseMargin }}>
            <Button
              large
              style={[Styles.buttonRadius, { width: Metrics.screenWidth / 6 }]}
              textStyle={styles.loginButtonText}
              onPress={() => props.attemptSetPassword(props.email, props.password)}
            >
                <Text>Set Password</Text>
            </Button>
          </View>
        </View>}
      </View>
    </ImageBackground>
  </View>
);

ForgotPassword.propTypes = {
  setAccountPassword: PropTypes.func,
  attemptSetPassword: PropTypes.func,
};


function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setAccountPassword: password => dispatch(setAccountPassword(password)),
    attemptSetPassword: (email, password) => dispatch(attemptSetPassword(email, password)),
    login: () => {
      dispatch(replaceAt('set-password', { key: 'login' }, 'global'));
      dispatch(clearSetPassword());
    },
    dispatch,
  };
}

function mapStateToProps(state) {
  const { attempting, error, email, done, password, user } = state.SetPasswordReducer;
  return { attempting, error, email, done, password, user };
}

export default connect(mapStateToProps, bindActions)(ForgotPassword);
