import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Image, View, Text, WebView, Linking, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import navigateTo from '@actions/sideBarNav';

import { Styles, Images, Metrics, Colors } from '@theme/';
import styles from './styles';

const {
  replaceAt,
  popRoute,
} = actions;


class About extends Component {  // eslint-disable-line
  static propTypes = {
    popRoute: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
    replaceAt: PropTypes.func,
    navigateTo: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }
  replaceRoute(route) {
    this.props.replaceAt('home', { key: route }, 'global');
  }
  navigateTo(route) {
    this.props.navigateTo(route, 'showPage');
  }
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
        <View style={{ flexDirection: 'row', marginTop: Metrics.baseMargin, justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ color: Colors.textPrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40 }}>
              ReadAskChat
            </Text>
          </View>
        </View>
        {/*{this.props.connectionState.toLowerCase() === 'wifi' && <WebView*/}
        {/*source={{ uri: 'https://player.vimeo.com/video/229298776' }}*/}
        {/*style={{ height: 200, marginTop: 12 }}*/}
        {/*/>*/}
        {/*}*/}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: Colors.textSecondary }} >
          <Text>
            For support or information, please contact us at info@readaskchat.net.
          </Text>
        </View>
        <Text style={{
          color: Colors.textSecondary,
          marginVertical: Metrics.doubleBaseMargin,
          fontSize: Metrics.screenWidth / 43,
          textAlign: 'left',
        }}
        >
          {this.props.copyright}
        </Text>

        <View style={[Styles.right, { flexDirection: 'row-reverse', justifyContent: 'space-between' }]}>
          <TouchableOpacity
            style={[Styles.center, styles.buttonStyle]}
            // onPress={() => props.replaceAt('setting', { key: 'terms' }, 'global')}
             onPress={() => this.props.replaceAt('home', { key: 'terms' }, 'global')}
          >
            <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 48 }}>
              Terms of Service
          </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  connectionState: state.connectionReducer.connectionState,
  copyright: state.credential.copyright,
});

export default connect(mapStateToProps, bindAction)(About);
