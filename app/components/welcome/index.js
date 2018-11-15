
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { View } from 'native-base';

import { attemptLogin, setEmail, setPassword, resendVerification, attemptForgotPassword, resetPassword } from '@actions/Creators';
import { Images, Metrics, Styles, Colors } from '@theme/';
import styles from './styles';

const {
    replaceAt,
} = actions;

class Welcome extends Component {

  static propTypes = {
      navigation: PropTypes.shape({
          key: PropTypes.string,
      }),
      replaceAt: PropTypes.func,
      navigateTo: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.loggedIn) {
      this.replaceRoute('home');
    }
  }

  replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, 'global');
  }

  register() {
    this.replaceRoute('register');
  }

  confirmLogin() {
    this.replaceRoute('confirmlogin');
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
          <View style={{flex: 1, margin: Metrics.doubleBaseMargin, backgroundColor: Colors.brandPrimary}}>
            <View style={{ flex: 1, marginVertical: Metrics.doubleBaseMargin, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{ fontSize: Metrics.screenWidth / 30, color: Colors.black, paddingTop: 2*Metrics.doubleBasePadding}}>
                    Welcome.
                </Text>
            </View>
            <View style={{ flex: 1, marginVertical: Metrics.doubleBaseMargin, backgroundColor: Colors.brandPrimary, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{ fontSize: Metrics.screenWidth / 30, color: Colors.black }}>
                    Are you sure using an organization code?
                </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: Metrics.doubleBaseMargin}}>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'center', paddingLeft: 10 }}>
                    <Text
                        style={{
                            fontSize: Metrics.screenWidth / 30,
                            color: Colors.textFourth,
                        }}
                        onPress={() => this.register()}
                    >YES</Text>
                </View>
                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'center', paddingRight: 10 }}>
                    <Text
                        style={{
                            fontSize: Metrics.screenWidth / 30,
                            color: Colors.textFourth,
                        }}
                        onPress={() => this.confirmLogin()}
                    >NO</Text>
                </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

function bindAction(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    };
}

const mapStateToProps = state => ({
    navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(Welcome);
