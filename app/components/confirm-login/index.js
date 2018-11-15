
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, TextInput, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Text, Button, View, CheckBox } from 'native-base';
import theme from '../../themes/base-theme';
import { scaleByVertical, scale } from '../../scaling/utils';

import { attemptRegister, setRegisterEmail, setRegisterCode, setRegisterPassword, setRegiserSubscription } from '@actions/Creators';
import { Images, Metrics, Styles, Colors } from '@theme/';
import styles from './styles';
import Terms from '../../Terms';

const {
  replaceAt,
} = actions;

const ConfirmLogin = props => (
  <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandSecondary }]}>
    <View style={[styles.headerView, { flexDirection: 'row', alignItems: 'center', paddingRight: 20 }]}>
      <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
    </View>
    <ImageBackground
      source={Images.launchScreen}
      resizeMode={'stretch'}
      style={{ flex: 1, width: null, height: null }}
    >
      <View style={{ flex: 1, margin: Metrics.doubleBaseMargin, /* padding: Metrics.baseMargin*/ backgroundColor: Colors.brandPrimary }}>
        <ScrollView style={{ marginHorizontal: Metrics.doubleBasePadding, flex: 1, marginTop: 10, /* padding: 5*/ paddingTop: 5, paddingBottom: 5 }}>
          <Text style={{ color: 'grey', marginTop: 10, textAlign: 'justify', paddingBottom: theme.screenHeight / 10 }}>{Terms}</Text>
        </ScrollView>
      </View>
    </ImageBackground>
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        height: theme.screenHeight / 10,
        backgroundColor: '#f0f0f0',
        width: Metrics.screenWidth,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 30,
      }}
    >
      <Text>By logging in, you agree the Terms and Conditions.</Text>
      {props.attempting ? <ActivityIndicator size={'large'} /> :
      <View style={{ flex: 0 }}>
        <Button
          large
          style={[Styles.buttonRadius, { width: Metrics.screenWidth / 7, flex: 1, margin: 3, shadowOpacity: 0, justifyContent: 'center', flexDirection: 'row',  alignItems: 'center', }]}
          onPress={() => props.replaceAt('confirmlogin', { key: 'login' }, 'global')}
        ><Text style={{ fontSize: Metrics.screenWidth / 40, alignItems: 'center' }}> Login</Text>
          </Button>
      </View>
        }
    </View>
  </View>
  );

ConfirmLogin.propTypes = {
    navigation: PropTypes.shape({
        key: PropTypes.string,
    }),
    replaceAt: PropTypes.func,
    navigateTo: PropTypes.func,
};

function bindActions(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(ConfirmLogin);
