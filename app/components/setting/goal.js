import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Picker from 'react-native-picker';
import navigateTo from '@actions/sideBarNav';
import { Radio } from 'native-base';
import { saveGoal } from '@actions/Creators';
import Utils from '../../utils';

import { Styles, Metrics, Colors } from '@theme/';

import styles from './styles';

const {
  replaceAt,
  popRoute,
} = actions;


class Goal extends Component {  // eslint-disable-line
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
      weekFrequency: 5,
      dayFrequency: 15,
      period: 'week',
      hasGoal: false,
      isPickerShowing: false,
    };
  }

  setCurrentGoal(goal) {
    const [frequency, period] = goal.split('-');
    this.setState({
      period: period === 'tpw' ? 'week' : 'day',
      hasGoal: goal !== '',
      currentGoal: {
        period: period === 'tpw' ? 'week' : 'day',
        dayFrequency: period === 'mpd' ? frequency : this.state.dayFrequency,
        weekFrequency: period === 'tpw' ? frequency : this.state.weekFrequency,
      },
      dayFrequency: period === 'mpd' ? frequency : this.state.dayFrequency,
      weekFrequency: period === 'tpw' ? frequency : this.state.weekFrequency,
    });
  }

  componentWillMount() {
    this.setCurrentGoal(this.props.goalFrequency);
  }
  componentWillUnmount() {
    this.setState({
      isPickerShowing: false,
    });
    Picker.isPickerShow(() => Picker.hide());
  }

  componentWillReceiveProps(nextProps) {
    this.setCurrentGoal(nextProps.goalFrequency);
  }

  submitGoal(periodFrequency) {
    let period = 'tpw';
    if (this.state.period === 'day') {
      period = 'mpd';
    }
    const goalFrequency = `${periodFrequency}-${period}`;
    this.props.saveGoal(goalFrequency);
  }

  async showPicker() {
    const connection = await Utils.checkConnection();
    if (!connection) {
      Alert.alert('No connectivity to the Internet. Please connect to the internet.');
      return;
    }
    let data = Array(14 - 1).fill().map((v, i) => i + 2);
    if (this.state.period === 'day') {
      data = Array(30 - 4).fill().map((v, i) => i + 5);
    }
    Picker.init({
      pickerData: data,
      selectedValue: [this.state[`${this.state.period}Frequency`]],
      onPickerConfirm: (value) => {
          this.submitGoal(value[0]);
      },
      pickerTitleText: 'Select your Goal frequency',
    });
    Picker.show();
    this.setState({
      isPickerShowing: true,
    });
  }
  setPeriod(period) {
    this.setState({
      period,
    }, () => this.showPicker());
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
        <View style={{ marginTop: Metrics.baseMargin }}>          
          <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>
            Goals
          </Text>
          <Text style={{ color: Colors.textSecondary, marginTop: Metrics.doubleBaseMargin, fontSize: Metrics.screenWidth / 43 }}>
            Set a daily or weekly goal.{"\n"}
            Your current goal is&nbsp; 
            {this.state.currentGoal.period === 'week' ? this.state.currentGoal.weekFrequency : this.state.currentGoal.dayFrequency} 
            {this.state.currentGoal.period === 'week' ? ' times per week' : ' minutes per day'}
          </Text>          
        </View>
        <View style={{marginTop: Metrics.doubleBaseMargin, borderRadius: 10 }}>
          <Text style={{ color: Colors.textSecondary, marginBottom: Metrics.doubleBaseMargin / 2, fontSize: Metrics.screenWidth / 40 }}>
            Set a new goal :
          </Text>
          <TouchableOpacity onPress={() => this.setPeriod('week')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.baseMargin }}>
            <Radio selected={this.state.period === 'week'} onPress={() => this.setPeriod('week')} style={{ marginRight: 10 }} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: Metrics.screenWidth / 40 }}>Read</Text>
              <Text onPress={() => this.showPicker()} style={{ borderBottomColor: '#333', borderBottomWidth: 2, marginLeft: 10, marginRight: 10, textDecorationLine: 'underline', fontSize: Metrics.screenWidth / 40 }}>{this.state.weekFrequency}</Text>
              <Text style={{ fontSize: Metrics.screenWidth / 40 }}>times per week</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setPeriod('day')} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: Metrics.baseMargin }}>
            <Radio selected={this.state.period === 'day'} onPress={() => this.setPeriod('day')} style={{ marginRight: 10 }} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: Metrics.screenWidth / 40 }}>Read</Text>
              <Text onPress={() => this.showPicker()} style={{ borderBottomColor: '#333', borderBottomWidth: 2, marginLeft: 10, marginRight: 10, textDecorationLine: 'underline', fontSize: Metrics.screenWidth / 40 }}>{this.state.dayFrequency}</Text>
              <Text style={{ fontSize: Metrics.screenWidth / 40 }}>minutes per day</Text>
            </View>
          </TouchableOpacity>
          {this.state.saving && this.loadingView()}
        </View>
      </View>
    );
  }
  loadingView() {
    return (<View>
      <ActivityIndicator
        size={'large'}
      />
    </View>);
  }

 // this button is no longer used
  buttonsView() {
    return (this.state.isPickerShowing ? null :
    <View style={[Styles.right, { flexDirection: 'row' }]}>
      <TouchableOpacity
        style={[Styles.center, styles.buttonStyle]}
        onPress={() => this.submitGoal()}
      >
        <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
          Save
        </Text>
      </TouchableOpacity>
    </View>);
  }
}

function bindAction(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    popRoute: key => dispatch(popRoute(key)),
    saveGoal: goalFrequency => dispatch(saveGoal({ goalFrequency })),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  goalFrequency: state.credential.user.goal_frequency,
});

export default connect(mapStateToProps, bindAction)(Goal);
