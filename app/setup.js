
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';

import App from './App';
import configureStore from './configureStore';

const { width } = Dimensions.get('window');

function setup():React.Component {
  class Root extends Component {

    constructor() {
      super();
      this.state = {
        isLoading: false,
        totalProgress: 0,
        store: configureStore(() => this.setState({ isLoading: false })),
      };
    }
    // componentDidMount() {
    //   codePush.sync({
    //     updateDialog: false,
    //     installMode: codePush.InstallMode.IMMEDIATE,
    //   });
    // }
    codePushDownloadDidProgress(progress) {
      console.log('progress');
      let totalProgress = Math.ceil((progress.receivedBytes / progress.totalBytes) * 100);
      if (totalProgress > 99) {
        totalProgress = 0;
      }
      this.setState({
        progress: totalProgress,
      });
    }
    render() {
      return (
        <Provider store={this.state.store}>
          <View style={{ flex: 1 }}>
            <App />
            <View style={{ height: 5, position: 'absolute', top: 0, left: 0, backgroundColor: 'green', width: width * (this.state.totalProgress/100) }} />
          </View>
        </Provider>
      );
    }
  }
  return codePush({
    updateDialog: false,
    installMode: codePush.InstallMode.ON_NEXT_RESUME,
  })(Root);
}

export default setup;
