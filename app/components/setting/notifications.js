import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { Radio } from 'native-base';
import { setPreference } from '@actions/Creators';
import RadioButton from 'react-native-radio-button';
import { Styles, Metrics, Colors } from '@theme/';

class Notifications extends Component {
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
        <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Notifications</Text>
        <Text style={{ color: Colors.textSecondary, marginVertical: Metrics.doubleBaseMargin, fontSize: Metrics.screenWidth / 43 }}>ReadAskChat sends push notifications that suggest fun and effective reading tips and ways families can keep their conversations going.</Text>
        <TouchableOpacity onPress={() => this.props.setNotificationEnabled(true)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.baseMargin }}>
            <RadioButton
                anmation={'bounceIn'}
                size={13}
                innerColor={'#999999'}
                outerColor={'#999999'}
                isSelected={this.props.notificationEnabled}
                onPress={() => this.props.setNotificationEnabled(true)}
            />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.textSecondary, marginLeft: Metrics.baseMargin }}>
              On
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.setNotificationEnabled(false)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <RadioButton
                anmation={'bounceIn'}
                size={13}
                innerColor={'#999999'}
                outerColor={'#999999'}
                isSelected={!this.props.notificationEnabled}
                onPress={() => this.props.setNotificationEnabled(false)}
            />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.textSecondary, marginLeft: Metrics.baseMargin }}>
              Off
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    setNotificationEnabled: isEnabled => dispatch(setPreference('notificationEnabled', isEnabled)),
  };
}

const mapStateToProps = state => ({
  notificationEnabled: state.preference.notificationEnabled,
});

export default connect(mapStateToProps, bindAction)(Notifications);
