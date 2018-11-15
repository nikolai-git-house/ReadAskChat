
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, ImageBackground, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Button, View } from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

import { attemptLogin, setEmail, setPassword, resendVerification, attemptForgotPassword, resetPassword } from '@actions/Creators';
import { Images, Metrics, Styles, Colors } from '@theme/';
import ForgotPassword from '@components/setting/account/forgot';
import styles from './styles';
import { scaleByVertical } from '../../scaling/utils';

const Analytics = require('react-native-firebase-analytics');
const Fabric = require('react-native-fabric');

const { Crashlytics } = Fabric;

const {
  replaceAt,
} = actions;

class Login extends Component {

  static propTypes = {
    replaceAt: PropTypes.func,
    attemptLogin: PropTypes.func,
    setEmail: PropTypes.func,
    setPassword: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: 'demo@demo.com',
      password: '123456',
      scroll: false,
      isChecked: false,
    };
  }
  componentDidMount() {
    if (this.props.loggedIn) {
      this.replaceRoute('home');
    }
  }

  componentWillReceiveProps(props) {
    if (props.error && props.error.message === 'Account is not verified.') {
      this.notVerified.show();
    } else if (props.error && props.error.message === 'Incorrect password, try again.') {
      this.invalidPass.show();
    } else if (!props.error) {
      this.notVerified.dismiss();
      this.invalidPass.dismiss();
    }
  }

  replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, 'global');
  }
  register() {
    this.replaceRoute('register');
  }
  forgotPassword() {
    this.forgotDialog && this.forgotDialog.show();
  }

  attemptLogin() {
    Analytics.logEvent('guest_login', null);
    this.props.attemptLogin({ user: this.props.user });
  }
  gotoMain() {
   // this.testingCrashlytics();
    this.replaceRoute('home', { email: this.state.email, password: this.state.password });
  }
  testingCrashlytics() {
    alert('testing crashlytics');
    Crashlytics.setUserName('megaman');

    Crashlytics.setUserEmail('user@email.com');

    Crashlytics.setUserIdentifier('1234');

    Crashlytics.setBool('has_posted', true);

    Crashlytics.setString('organization', 'Acme. Corp');

    Crashlytics.crash();

    Crashlytics.setNumber('post_count', 5);

    Crashlytics.logException('');
  }
  actionLogin() {
    return (this.props.attempting ?
      <ActivityIndicator size={'large'} /> : <Button
        large
        style={[Styles.buttonRadius, { width: Metrics.screenWidth / 9, height: Metrics.screenHeight / 10, shadowOpacity: 0, alignItems: 'center', justifyContent: 'center' }]}
        onPress={() => this.attemptLogin()}
      >
          <Text style={styles.loginButtonText}>Login</Text>
    </Button>);
  }

  renderForgotDialog() {
    return (
      <PopupDialog
        ref={(dialog) => { this.forgotDialog = dialog; }}
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        width={Metrics.screenWidth / 2.1}
        height={Metrics.screenHeight / 1.5}
      >
        <ForgotPassword onClose={() => this.forgotDialog.dismiss()} />
      </PopupDialog>
    );
  }

  render() {
    return (
      <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandPrimary }]}>
        <View style={styles.headerView}>
          <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
        </View>
        <ImageBackground
          source={Images.launchScreen}
          resizeMode={'stretch'}
          style={{ flex: 1, width: null, height: null }}
        >
          <View style={{ flex: 1, margin: Metrics.doubleBaseMargin, backgroundColor: Colors.brandPrimary }}>
            <Text style={{ fontSize: scaleByVertical(20), color: Colors.titlePrimary, padding: Metrics.doubleBasePadding, lineHeight: Math.ceil(scaleByVertical(32)) }}>
              Welcome. Sign in below.
            </Text>
            {this.props.error && this.props.error.message === 'User email does not exist, please create one.' && <View style={{ padding: 10, backgroundColor: Colors.warningPrimary }}>
              <Text>{this.props.error.message}</Text>
            </View>}
            <KeyboardAvoidingView
              behavior={'position'}
              contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Metrics.doubleBaseMargin }}
              keyboardVerticalOffset={Metrics.screenHeight < 376 ? 70 : 0}
            >
              {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Metrics.doubleBaseMargin }}>   */}
              <View style={{ flex: 1, alignItems: 'flex-start', marginHorizontal: 5, padding: 8, borderColor: 'grey', borderBottomWidth: 1 }}>
                <TextInput
                  style={{ height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.45, fontSize: Metrics.screenWidth / 35 }}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  placeholder="Email"
                  keyboardType={'email-address'}
                  onChangeText={email => this.props.setEmail(email)}
                  autoCorrect={false}
                />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start', marginHorizontal: 5, padding: 8, borderColor: 'grey', borderBottomWidth: 1 }}>
                <TextInput
                  style={{ height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.45, fontSize: Metrics.screenWidth / 35 }}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  secureTextEntry
                  placeholder="Password"
                  onChangeText={password => this.props.setPassword(password)}
                />
              </View>
              {/* </View>   */}
            </KeyboardAvoidingView>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.baseMargin }}>
              <View style={{ flex: 1, alignItems: 'flex-start', marginRight: Metrics.smallMargin }} />
              <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: Metrics.smallMargin }}>
                <TouchableOpacity onPress={this.forgotPassword.bind(this)}>
                  <Text style={{ padding: Metrics.screenWidth * 0.0005, fontSize: Metrics.screenWidth / 50, color: Colors.textFourth, lineHeight: 32 }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Metrics.doubleBaseMargin }}>
              {this.actionLogin()}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: Metrics.doubleBasePadding, marginTop: scaleByVertical(10) }}>
              <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 10 }}>
                <Text style={{ fontSize: Metrics.screenWidth / 45, lineHeight: Math.ceil(scaleByVertical(20)) }}>
                  New users
                  <Text
                    style={{
                        fontSize: Metrics.screenWidth / 45,
                        color: Colors.textFourth,
                    }}
                    onPress={() => this.register()}
                  > register here</Text>
                </Text>
              </View>
              <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
                <Text
                  style={{
                      fontSize: Metrics.screenWidth / 45,
                      color: Colors.textFourth,
                  }}
                  onPress={() => this.gotoMain()}
                > skip</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        {this.renderForgotDialog()}
        <PopupDialog
          ref={(ref) => { this.notVerified = ref; }}
          width={Metrics.screenWidth / 2}
          height={Metrics.screenHeight / 1.8}
        >
          <View style={{ justifyContent: 'space-between', padding: 10, flex: 1 }}>
            <Text style={{ fontSize: Metrics.screenWidth / 40, padding: 5 }}>You must first click the verification link in an email we sent you to verify your account prior to logging in.</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

              <Button
                style={[Styles.buttonRadius, styles.downloadButtonM]}
                onPress={() => this.notVerified.dismiss()}
              >
                <Text style={styles.loginButtonText}>Dismiss</Text>
              </Button>

              <Button
                style={[Styles.buttonRadius, styles.downloadButtonM]}
                onPress={() => this.props.resendVerification(this.props.user.email)}
              >
                  <Text style={styles.loginButtonText}>Resend Verification Email</Text>
              </Button>

            </View>
          </View>
        </PopupDialog>
        <PopupDialog
          ref={(ref) => { this.invalidPass = ref; }}
          width={300}
          height={200}
        >
          <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin, marginTop: Metrics.baseMargin, marginBottom: Metrics.baseMargin }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Incorrect Password</Text>
              <View style={{ paddingTop: 10 }}>
                <Text>Please try again or reset your password</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: Metrics.baseMargin }}>
                <Button
                  style={[Styles.buttonRadius, styles.downloadButtonM]}
                  onPress={() => this.invalidPass.dismiss()}
                >
                  <Text style={styles.loginButtonText}>Dismiss</Text>
                </Button>
                <Button
                  style={[Styles.buttonRadius, styles.downloadButtonM]}
                  onPress={() => this.props.attemptForgotPassword(this.props.user.email)}
                >
                    <Text style={styles.loginButtonText}>Reset password</Text>
                </Button>
              </View>
            </View>
          </View>
        </PopupDialog>
      </View>
    );
  }
}


function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    attemptLogin: user => dispatch(attemptLogin(user)),
    setEmail: email => dispatch(setEmail(email)),
    setPassword: password => dispatch(setPassword(password)),
    resendVerification: email => dispatch(resendVerification(email)),
    attemptForgotPassword: email => dispatch(attemptForgotPassword(email)),
  };
}

function mapStateToProps(state) {
  const { attempting, error, user, email, password } = state.LoginReducer;
  const { is_logged_in } = state.credential;
  return { attempting, loggedIn: is_logged_in, error, user, email, password };
}

export default connect(mapStateToProps, bindActions)(Login);
