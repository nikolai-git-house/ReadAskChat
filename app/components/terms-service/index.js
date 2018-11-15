import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, ScrollView } from 'react-native';
import { Text, Button, View, CheckBox } from 'native-base';
import theme from '../../themes/base-theme';
import { scaleByVertical, scale } from '../../scaling/utils';
import navigateTo from '@actions/sideBarNav';

import { attemptRegister, setRegisterEmail, setRegisterCode, setRegisterPassword, setRegiserSubscription } from '@actions/Creators';
import { Images, Metrics, Styles, Colors } from '@theme/';
import styles from './styles';
import Terms from '../../Terms';
import {connect} from "react-redux";

class TermsOfService extends Component {
    static propTypes = {
        navigateTo: PropTypes.func,
    }

    constructor(props) {
        super(props);
    }

    navigateTo(route, params = {}) {
        console.log(route);
        this.props.navigateTo(route, 'home', params);
    }

    render() {
        return(
            <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandSecondary }]}>
                <View style={[styles.headerView, { flexDirection: 'row', alignItems: 'center', paddingRight: 20 }]}>
                    <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
                </View>
                <ImageBackground
                    source={Images.launchScreen}
                    resizeMode={'stretch'}
                    style={{ flex: 1, width: null, height: null }}
                >
                    <View style={{ flex: 1, margin: Metrics.baseMargin, backgroundColor: Colors.brandPrimary }}>
                        <View style={{flexDirection:  'row', justifyContent: 'space-between'}}>
                            <Text style={styles.title}>Terms Of Service</Text>
                            <View style={{ flex: 0 }}>
                                <Button
                                    large
                                    style={[Styles.buttonRadius, styles.agreeButton]}
                                    onPress={() => this.navigateTo('home')}
                                ><Text style={{ fontSize: Metrics.screenWidth / 45, lineHeight: Math.ceil(scaleByVertical(13)) }}>Agree</Text>
                                </Button>
                            </View>
                        </View>
                        <ScrollView style={{ marginHorizontal: Metrics.doubleBasePadding, flex: 1, marginTop: 10, paddingHorizontal: 5 }}>
                            <Text style={{ color: 'grey', textAlign: 'justify', paddingBottom: theme.screenHeight / 10 }}>{Terms}</Text>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

function bindAction(dispatch) {
    return {
        navigateTo: (route, termsRoute, params) => dispatch(navigateTo(route, termsRoute, params)),
    };
}

function mapStateToProps(state) {
    const { email, first_time } = state.credential;
    return { email, first_time };
}

export default connect(mapStateToProps, bindAction)(TermsOfService);
