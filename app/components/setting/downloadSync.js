import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { View, Text, TouchableOpacity, Alert, NetInfo } from 'react-native';

import navigateTo from '@actions/sideBarNav';
import { syncAll, syncOnlineContent } from '@actions/Creators';
import * as Progress from 'react-native-progress';

import { Styles, Metrics, Colors } from '@theme/';
import styles from './styles';

const {
  replaceAt,
  popRoute,
} = actions;


class DownloadSync extends Component {  // eslint-disable-line
  static propTypes = {
    popRoute: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
    replaceAt: PropTypes.func,
    navigateTo: PropTypes.func,
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
  syncAll() {
    Alert.alert('Sync all content', 'This will overwrite your existing downloaded packs. Are you sure?', [
      { text: 'No', onPress: () => {} },
      { text: 'Yes', onPress: () => this.checkWiFi() },
    ]);
  }
  syncOnlineContent() {
    Alert.alert('Sync online content', 'This will download all available online contents to your device. Are you sure?', [
      { text: 'No', onPress: () => {} },
      { text: 'Yes', onPress: () => this.props.syncOnlineContent() },
    ]);
  }
  checkWiFi() {
    NetInfo.fetch().then((reach) => {
      if (reach.toLowerCase() !== 'wifi') {
        Alert.alert('Sync online content', 'This may consume data, are you sure you want to continue without WIFI connectivity?', [
          { text: 'No', onPress: () => {} },
          { text: 'Yes', onPress: () => this.props.syncAll() },
        ]);
      } else {
        this.props.syncAll();
      }
    });
  }
  progressView() {
    return (<View style={{ alignSelf: 'center' }}>
      <Progress.Bar
        progress={this.props.progress}
        width={Metrics.cellWidth}
        height={Metrics.baseMargin}
        borderRadius={0}
        style={{ marginTop: Metrics.doubleBaseMargin, marginLeft: -5 }}
      />
      <Text style={{ textAlign: 'center' }}>{`${Math.round(this.props.progress * 100)}%`}</Text>
    </View>);
  }
  buttonsView() {
    return (
      <View style={[Styles.right, { flexDirection: 'row-reverse', justifyContent: 'space-between' }]}>
        <TouchableOpacity
          style={[Styles.center, styles.buttonStyle]}
          onPress={() => this.syncAll()}
        >
          <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 48 }}>
            Sync All
          </Text>
        </TouchableOpacity>
        {this.props.isComplete && <Text>Download complete</Text>}
      </View>);
  }
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
        <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>
          Download & Sync
        </Text>
        <Text style={{ color: Colors.textSecondary, marginVertical: Metrics.doubleBaseMargin, fontSize: Metrics.screenWidth / 43 }}>
          Download and synchronize all available content to this device
        </Text>
        {this.props.isDownloading && this.progressView()}
        {this.props.isDownloading || this.buttonsView()}
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    popRoute: key => dispatch(popRoute(key)),
    syncAll: () => dispatch(syncAll()),
    syncOnlineContent: () => dispatch(syncOnlineContent()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  ...state.sync,
});

export default connect(mapStateToProps, bindAction)(DownloadSync);
