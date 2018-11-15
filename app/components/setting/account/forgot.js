import React from 'react';
import { View, ScrollView, Text, TextInput, ActivityIndicator } from 'react-native';
import { Button, Input } from 'native-base';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Metrics, Colors, Styles } from '@theme/';
import styles from '../styles';
import {
  attemptForgotPassword,
  setForgotEmail,
} from '@actions/Creators';

const {
  replaceAt,
} = actions;

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      done: false,
      error:false,
    };
  }
  componentWillMount() {

    this.setState({
      email: this.props.credentialEmail,
    });
  }
  componentWillReceiveProps(nextProps) {

  if (!nextProps.done && this.props.done) {
      setTimeout(() => {
        this.props.onClose();
      }, 1 * 1000);
    }
  else if (!nextProps.error && this.props.error) {
      setTimeout(() => {
        this.props.onClose();
      }, 1 * 1000);
    }
  }
  renderLoading() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  renderButtons() {
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
          onPress={() => this.props.attemptForgotPassword(this.state.email)}
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
          <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Forgot Password</Text>
          <View style={{ paddingTop: 10 }}>
            <Text>Enter your email and we'll send you a new password</Text>
          </View>
          {/* {this.props.error && this.props.error.message === 'Account does not exist.' && <View style={{ padding: 10, backgroundColor: Colors.warningPrimary }}>
              <Text>{this.props.error.message}</Text>
            </View>} */}
          {this.props.error && <View style={{ padding: 10, backgroundColor: Colors.warningPrimary }}>
            <Text>{this.props.error.message}</Text>
          </View>}
          {this.props.done && <View style={{ padding: 10, backgroundColor: Colors.successPrimary }}>
            <Text>Password reset successfully</Text>
          </View>}
          <ScrollView style={{ flex: 1 }}>
            <Input
              style={{ borderWidth: 1, borderColor: '#c0c0c0', marginTop: 10, height: Metrics.screenWidth / 15, width: Metrics.screenWidth * 0.4, fontSize: Metrics.screenWidth / 35 }}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType={'email-address'}
              placeholder="Email"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
          </ScrollView>
          {this.props.attempting && this.renderLoading()}
          {this.props.attempting || this.renderButtons()}
        </View>
      </View>
    );
  }
}
function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setForgotEmail: email => dispatch(setForgotEmail(email)),
    attemptForgotPassword: email => dispatch(attemptForgotPassword(email)),
    dispatch,
  };
}

function mapStateToProps(state) {
  const { email: credentialEmail } = state.credential;
  const { attempting, error, email, done } = state.ForgotPasswordReducer;
  return { attempting, error, email, done, credentialEmail };
}
export default connect(mapStateToProps, bindActions)(ForgotPassword);
