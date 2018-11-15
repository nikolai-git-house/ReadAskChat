import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import { Image, Platform, View, ActivityIndicator, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import DatabaseService from '@database/DatabaseService';
import PackModel from '@database/PackModel';
import PendingModel from '@database/PendingModel';
import { Images, Metrics } from '@theme/';

const {
  replaceAt,
} = actions;

class SplashPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: '',
    };
  }
  static propTypes = {
    replaceAt: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  };

  componentWillMount() {
    const racVersion = DeviceInfo.getVersion();
    AsyncStorage.setItem('device', DeviceInfo.getVersion());
    AsyncStorage.getItem('device', (err, result) => {
      this.setState({
        status: result,
      });
      if (racVersion !== this.state.status) {
        DatabaseService.deleteAll();
      }
    });

    setTimeout(() => {
      this.replaceRoute('home');
    }, 1500);
  }
  replaceRoute(route) {
    this.props.replaceAt('splashscreen', { key: route }, this.props.navigation.key);
  }
  render() {
    if (Platform.OS === 'ios') {
      return (
        <View style={{
 width: Metrics.screenWidth, height: Metrics.screenHeight, flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center',
}}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <Image
        source={Images.splash}
        resizeMode="stretch"
        style={{
 width: Metrics.screenWidth, height: Metrics.screenHeight, flex: 1, backgroundColor: 'white',
}}
      />
    );
  }
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
  };
}
const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});
export default connect(mapStateToProps, bindActions)(SplashPage);
