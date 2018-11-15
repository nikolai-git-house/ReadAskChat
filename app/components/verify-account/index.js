import React, { Component } from 'react';
import { View, Image, ImageBackground, Text } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';

import { Images, Metrics, Styles, Colors } from '@theme/';
import styles from './styles';

const { replaceAt } = actions;

const VerifyAccount = props => (
  <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandSecondary }]}>
    <View style={styles.headerView}>
      <Image
        source={Images.logo}
        resizeMode={'contain'}
        style={styles.headerViewLogo} 
      />
    </View>
    <ImageBackground
      source={Images.launchScreen}
      resizeMode={'stretch'}
      style={{ flex: 1, width: null, height: null,
      }}
    >
      <View
        style={{
          flex: 1,
          margin: Metrics.doubleBaseMargin,
          padding: Metrics.doubleBaseMargin,
          backgroundColor: Colors.brandPrimary,
        }}
      >
        <View>
          <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.doubleBaseMargin, marginLeft: Metrics.doubleBaseMargin }}>You're almost there!</Text>
          <Text
            style={{
              fontSize: Metrics.screenWidth / 32,
              color: Colors.titleColor,
              padding: Metrics.doubleBaseMargin,
            }}
          >
          We've sent you an email with instructions for completing your registration. Please check your inbox (and perhaps your spam folder).
          </Text>
        </View>
        
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: Metrics.doubleBaseMargin,
          }}
        >
          <Button
            large
            style={[Styles.buttonRadius, {
              width: Metrics.screenWidth / 4,
              marginRight: 20,
              justifyContent: 'center'
            }]}
            onPress={() => props.pushRoute('verify-account', {
              key: 'login',
            }, 'global')}
          >
              <Text style={styles.loginButtonText}>Return to login</Text>
          </Button>
          {/* <Button
            large
            style={{
              width: Metrics.screenWidth / 6,
            }}
            textStyle={styles.loginButtonText}
            onPress={() => props.pushRoute('verify-account', {
              key: 'set-password',
            }, 'global')}
          >
            Set Password
          </Button>*/}
        </View>
      </View>
    </ImageBackground>
  </View>
);

VerifyAccount.propTypes = {};

function bindActions(dispatch) {
  return {
    pushRoute: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
  };
}
const mapStateToProps = state => ({ navigation: state.cardNavigation });
export default connect(mapStateToProps, bindActions)(VerifyAccount);
