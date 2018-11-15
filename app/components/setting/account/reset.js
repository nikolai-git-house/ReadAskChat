import React from 'react';
import { View, ScrollView, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import { Metrics, Colors, Styles } from '@theme/';
import styles from '../styles';
import theme from '../../../themes/base-theme';
import {
  resetPassword,
} from '@actions/Creators';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confirmPassword: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.resetError && nextProps.resetStatus) {
      setTimeout(() => {
        this.props.onClose();
      }, 500);
    }
  }
  renderLoading() {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  renderButtons() {
    const { newPassword, confirmPassword } = this.state;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: Metrics.baseMargin }}>
        <Button
          style={[Styles.buttonRadius, styles.cancelButton]}
          onPress={() => this.props.onClose()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Button>
        <Button
          style={[Styles.buttonRadius, styles.downloadButton]}
          onPress={() => this.props.resetPassword(newPassword)}
          disabled={(newPassword !== confirmPassword) || !newPassword || !confirmPassword}
        >
          <Text style={styles.downloadButtonText}>Submit</Text>
        </Button>
      </View>
    );
  }
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin, marginTop: Metrics.baseMargin, marginBottom: Metrics.baseMargin }}>
        <View style={{ flex: 1 }}>

          <ScrollView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{ fontSize: theme.screenWidth / 45, fontWeight: 'bold', flex: 1 }}
              >Reset Password</Text>
            </View>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#c0c0c0', marginTop: 10, height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.4, fontSize: Metrics.screenWidth / 35 }}
              placeholderTextColor="dimgrey"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="New password"
              value={this.state.newPassword}
              onChangeText={newPassword => this.setState({ newPassword })}
              secureTextEntry
            />
            <TextInput
              style={{ borderWidth: 1, borderColor: '#c0c0c0', marginTop: 10, height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.4, fontSize: Metrics.screenWidth / 35 }}
              underlineColorAndroid="transparent"
              placeholderTextColor="dimgrey"
              autoCapitalize="none"
              placeholder="Confirm New Password"
              value={this.state.confirmPassword}
              onChangeText={confirmPassword => this.setState({ confirmPassword })}
              secureTextEntry
            />
            {this.props.resetStatus ? <View style={{ padding: 2, backgroundColor: this.props.resetError ? Colors.errorPrimary : Colors.successPrimary, flex: 1, width: Metrics.screenWidth * 0.4 }}>
              <Text>{this.props.resetStatus}</Text>
            </View> : null}
          </ScrollView>
          {this.props.resetLoading && this.renderLoading()}
          {this.props.resetLoading || this.renderButtons()}
        </View>
      </View>
    );
  }
}
function bindActions(dispatch) {
  return {
    resetPassword: newPassword => dispatch(resetPassword(newPassword)),
    dispatch,
  };
}

function mapStateToProps(state) {
  const { user, resetStatus, resetError, resetLoading } = state.credential;
  return { resetLoading, user, resetStatus, resetError };
}
export default connect(mapStateToProps, bindActions)(ResetPassword);
