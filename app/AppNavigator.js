
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, Platform, StatusBar, View } from 'react-native';
import NavigationExperimental from 'react-native-navigation-experimental-compat';
import { connect } from 'react-redux';
import { Drawer } from 'native-base';
import { actions } from 'react-native-navigation-redux-helpers';

import { closeDrawer } from '@actions/Creators';

import Login from '@components/login';
import SplashPage from '@components/splashscreen';
import Home from '@components/home';
import ShowPage from '@components/showPage';
import Welcome from '@components/welcome';
import ConfirmLogin from '@components/confirm-login';
import SideBar from '@components/sideBar';
import Setting from '@components/setting';
import Register from '@components/register';
import TermsOfService from '@components/terms-service';
import VerifyAccount from '@components/verify-account';
import ForgotPassword from '@components/forgot-password';
import SetPassword from '@components/set-password';
import { statusBarColor } from '@theme/base-theme';
import Purchase from '@components/home/purchase';


const {
  popRoute,
} = actions;

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

class AppNavigator extends Component {

  static propTypes = {
    drawerState: PropTypes.string,
    popRoute: PropTypes.func,
    closeDrawer: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
      routes: PropTypes.array,
    }),
  }

  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', () => {
      const routes = this.props.navigation.routes;
      if (routes[routes.length - 1].key === 'home' || routes[routes.length - 1].key === 'login') {
        return false;
      }
      this.props.popRoute(this.props.navigation.key);
      return true;
    });
  }

  componentDidUpdate() {
    if (!this._drawer) {
      return;
    }
    if (this.props.drawerState === 'opened') {
      this.openDrawer();
    }

    if (this.props.drawerState === 'closed') {
      this._drawer.close();
    }
  }

  popRoute() {
    this.props.popRoute();
  }

  openDrawer() {
    this._drawer.open();
  }

  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }



  _renderScene(props) { // eslint-disable-line class-methods-use-this
    switch (props.scene.route.key) {
      case 'splashscreen':
        return <SplashPage />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'verify-account':
        return <VerifyAccount />;
      case 'forgot-password':
        return <ForgotPassword />;
      case 'set-password':
        return <SetPassword />;
      case 'home':
        return <Home />;
      case 'showPage':
        return <ShowPage />;
      case 'setting':
        return <Setting />;
      case 'welcome':
          return <Welcome />;
      case 'confirmlogin':
          return <ConfirmLogin />;
      case 'terms':
          return <TermsOfService />;
          case 'purchase':
          return <Purchase />;
      default :
        return <Login />;
    }
  }

  render() { // eslint-disable-line class-methods-use-this
    return (
      <View
        style={{ flex: 1 }}
      >
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle="light-content"
          hidden
        />
        <NavigationCardStack
          navigationState={this.props.navigation}
          renderOverlay={this._renderOverlay}
          renderScene={this._renderScene}
        />
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
  navigation: state.cardNavigation,
});


export default connect(mapStateToProps, bindAction)(AppNavigator);
