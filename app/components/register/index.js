
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Text, Button, View } from 'native-base';

import { attemptRegister, setRegisterEmail, setRegisterCode, setRegisterPassword, setRegiserSubscription } from '@actions/Creators';
import { Images, Metrics, Styles, Colors } from '@theme/';
import styles from './styles';

const {
  replaceAt,
} = actions;

const Register = props => (
  <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandSecondary }]}>
    <View style={[styles.headerView, { flexDirection: 'row', alignItems: 'center', paddingRight: 20 }]}>
      <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
      {/*<TouchableOpacity*/}
        {/*onPress={() => props.backLogin()}*/}
      {/*>*/}
        {/*<Text style={{ fontSize: 20, color: 'blue', paddingBottom: 5 }}>Login</Text>*/}
      {/*</TouchableOpacity>*/}
    </View>
    <ImageBackground
      source={Images.launchScreen}
      resizeMode={'stretch'}
      style={{ flex: 1, width: null, height: null }}
    >
      <View style={{ flex: 1, margin: Metrics.doubleBaseMargin, /* padding: Metrics.baseMargin*/ backgroundColor: Colors.brandPrimary }}>
        <Text style={styles.title}>
            Please register to access the full library.
          </Text>
        {props.error && <View style={{ padding: 10, backgroundColor: Colors.warningPrimary }}>
          <Text>{props.error}</Text>
          </View>}
        <View style={{ flexDirection: 'row', marginHorizontal: Metrics.doubleBaseMargin, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={styles.textInput}>
              <TextInput
                style={{ height: Metrics.screenWidth / 20, width: Metrics.screenWidth * 0.8, fontSize: Metrics.screenWidth / 35, padding: 0 }}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType={'email-address'}
                placeholder="Email"
                onChangeText={text => props.setRegisterEmail(text)}
              />
            </View>
            <View style={styles.textInput}>
              <TextInput
                style={{ height: Metrics.screenWidth / 20, width: Metrics.screenWidth * 0.4, fontSize: Metrics.screenWidth / 35, padding: 0 }}
                underlineColorAndroid="transparent"
                autoCapitalize="characters"
                keyboardType={'default'}
                placeholder="Organization Code [Optional]"
                onChangeText={code => props.setRegisterCode(code)}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={styles.textInput}>
              <TextInput
                style={{ height: Metrics.screenWidth / 20, width: Metrics.screenWidth * 0.8, fontSize: Metrics.screenWidth / 35, padding: 0 }}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                secureTextEntry
                keyboardType={'default'}
                placeholder="Create Password"
                onChangeText={pass => props.setRegisterPassword(pass)}
              />
            </View>
          </View>
        </View>
          <View style={{flexDirection: 'row', marginHorizontal: Metrics.doubleBaseMargin, justifyContent: 'center'}}>
              <Button
                  style={[Styles.buttonRadius, { width: Metrics.screenWidth / 6, margin: 20, shadowOpacity: 0, justifyContent: 'center', flexDirection: 'row',  alignItems: 'center', backgroundColor: 'transparent', }]}
                  onPress={() => props.replaceAt('register', { key: 'home' }, 'global')}
              ><Text style={[styles.cancelButtonText, { paddingVertical: 10 }]}>Cancel</Text>
              </Button>

              <Button
                  style={[Styles.buttonRadius, { width: Metrics.screenWidth /3, margin: 20, shadowOpacity: 0, justifyContent: 'center', flexDirection: 'row',  alignItems: 'center', backgroundColor: 'transparent', }]}
                  onPress={() => props.replaceAt('register', { key: 'login' }, 'global')}
              ><Text style={[styles.cancelButtonText, { paddingVertical: 10 }]}>Already Registered</Text>
              </Button>

              <Button
                  style={[Styles.buttonRadius, { width: Metrics.screenWidth / 7, margin: 20, shadowOpacity: 0, justifyContent: 'center', flexDirection: 'row',  alignItems: 'center', }]}
                  onPress={() => props.attemptRegister(props.email, props.registerPassword, props.registerCode, props.mailchimpSubscription)}
              ><Text style={{ fontSize: Metrics.screenWidth / 40, paddingVertical: 10 }}>Submit</Text>
              </Button>
          </View>
        {/*<View style={{ height: 25, paddingHorizontal: Metrics.doubleBasePadding, marginVertical: scaleByVertical(10), flexDirection: 'row', alignItems: 'center' }}>*/}
          {/*<CheckBox checked={props.mailchimpSubscription} onPress={() => props.setRegiserSubscription()} />*/}
          {/*<Text style={{ fontSize: 16, color: 'grey', marginLeft: 15 }}>Click here to keep up to date with the latest ReadAskChat news!</Text>*/}
        {/*</View>*/}
      </View>
    </ImageBackground>
  </View>
  );

Register.propTypes = {
  attemptRegister: PropTypes.func,
  backLogin: PropTypes.func,
  setRegisterEmail: PropTypes.func,
};

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    attemptRegister: (email, password, code, mailchimpSubscription) => dispatch(attemptRegister(email, password, code, mailchimpSubscription)),
    backLogin: () => dispatch(replaceAt('register', { key: 'login' }, 'global')),
    setRegisterEmail: email => dispatch(setRegisterEmail(email)),
    setRegisterCode: code => dispatch(setRegisterCode(code)),
    setRegisterPassword: pass => dispatch(setRegisterPassword(pass)),
    setRegiserSubscription: () => dispatch(setRegiserSubscription()),
    dispatch,
  };
}

function mapStateToProps(state) {
  const { attempting, error, email, registered, registerCode, registerPassword, mailchimpSubscription } = state.RegisterReducer;
  return { attempting, error, email, registered, registerCode, registerPassword, mailchimpSubscription };
}

export default connect(mapStateToProps, bindActions)(Register);
