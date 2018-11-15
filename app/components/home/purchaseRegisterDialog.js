import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, TextInput, TouchableOpacity, Animated, Dimensions, Keyboard} from 'react-native';
import { Images, Colors, Metrics, Styles } from '@theme/';
import styles from './styles';
import {connect} from "react-redux";

import navigateTo from '@actions/sideBarNav';
import {
    attemptCredentialUser,
    setCredentialUser,
    setCredentialLoggedIn,
    setCredentialEmail,
    setCredentialToken,
    attemptRegister,
    setRegisterEmail,
    setRegisterCode,
    setRegisterPassword,
    setRegiserSubscription,
    packsReset,
    logout,
} from '@actions/Creators';
import {actions} from "react-native-navigation-redux-helpers";

const {
    popRoute,
} = actions;
const { height } = Dimensions.get('window');

class PurchaseRegisterDialog extends React.Component {
    static propTypes = {
        popRoute: PropTypes.func,
        navigation: PropTypes.shape({
            key: PropTypes.string,
        }),
        replaceAt: PropTypes.func,
        navigateTo: PropTypes.func,
        attemptRegister: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: null,
            isOpen: false,
            keyboardHeight: 0,
            keyboardOpen: false,
            type: 0,
        };
        if (props.onReference) {
            props.onReference(this);
        }
    }

    componentWillMount() {
         this.props.attemptCredentialUser();
         this._registerEvents();
    }

    componentWillUnmount() {
         this._unRegisterEvents();
    }

    _registerEvents() {
        this._keyboardDidShowSubscription = Keyboard.addListener("keyboardWillShow", e => this._keyboardDidShow(e));
        this._keyboardDidHideSubscription = Keyboard.addListener("keyboardWillHide", e => this._keyboardDidHide(e));
    }

    _unRegisterEvents() {
        this._keyboardDidShowSubscription.remove();
        this._keyboardDidHideSubscription.remove();
    }

    _keyboardDidShow(e) {
        this.setState({
            keyboardOpen: true
        })
    }

    _keyboardDidHide(e) {
        this.setState({
            keyboardHeight: 0,
            keyboardOpen: false
        });
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

    promoCode() {
        this.props.onPromoCode();
    }

    hasPromoCode() {
        return this.props.credential.user.promo.code !== '';
    }

    onFocus(type) {
        if (type === 1)
            this.setState({
                keyboardHeight: Metrics.screenWidth / 20
            });
        else if (type === 2)
            this.setState({
                keyboardHeight: Metrics.screenWidth / 15
            });
        else
            this.setState({
                keyboardHeight: Metrics.screenWidth / 5
            });
    }

    onBlur() {
        this.setState({
            keyboardHeight: 0
        });
    }

    onLayout = ({ nativeEvent }) => {
        this.setState({
            height: nativeEvent.layout.height,
        });
    };

    closeDialog = () => {
        this.setState({
            isOpen: false,
        });
    };
    openDialog = () => {
        this.setState({
            isOpen: true,
        });
    };

    render() {
        return (
            <Animated.View style={[styles.purchaseContainer, { top: (this.state.isOpen && !this.state.keyboardOpen) ? 0 : (this.state.isOpen && this.state.keyboardOpen) ? -this.state.keyboardHeight : -height }]}>
                <View style={styles.purchaseDialogWrapper} onLayout={this.onLayout}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
                        <Text style={{ fontSize: Metrics.screenWidth / 48 }}><Text style={{ fontWeight: '700' }}>Please register</Text> to subscribe to the full library.</Text>
                        <Text style={{ fontSize: Metrics.screenWidth / 48 }}>Registration enables you to access</Text>
                        <Text style={{ fontSize: Metrics.screenWidth / 48 }}>the library on multiple devices</Text>
                    </View>
                    {this.props.error && <View style={{ padding: 10, backgroundColor: Colors.warningPrimary }}>
                        <Text>{this.props.error}</Text>
                    </View>}
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={{ width: '100%', fontSize: Metrics.screenWidth / 48, fontWeight: 'bold' }}>
                            Email
                        </Text>
                        <TextInput
                            style={{ width: Metrics.screenWidth * 0.45, height: Metrics.screenWidth / 20, fontSize: Metrics.screenWidth / 48, padding: 0, backgroundColor: '#b3b6bd', marginBottom: 5, paddingLeft: 5 }}
                            autoCapitalize="none"
                            keyboardType={'email-address'}
                            onChangeText={text => this.props.setRegisterEmail(text)}
                            onFocus={() => this.onFocus(1)}
                        />
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={{ width: '100%', fontSize: Metrics.screenWidth / 48, fontWeight: 'bold' }}>
                            Create Password
                        </Text>
                        <TextInput
                            style={{ width: Metrics.screenWidth * 0.45, height: Metrics.screenWidth / 20, fontSize: Metrics.screenWidth / 48, padding: 0, backgroundColor: '#b3b6bd', marginBottom: 5, paddingLeft: 5 }}
                            underlineColorAndroid="transparent"
                            autoCapitalize="characters"
                            secureTextEntry
                            keyboardType={'default'}
                            onChangeText={code => this.props.setRegisterPassword(code)}
                            onFocus={() => this.onFocus(2)}
                        />
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text style={{ width: '100%', fontSize: Metrics.screenWidth / 48, fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.5)' }}>
                            Organization Code [Optional]
                        </Text>
                        <TextInput
                            style={{ width: Metrics.screenWidth * 0.45, height: Metrics.screenWidth / 20, fontSize: Metrics.screenWidth / 48, padding: 0, backgroundColor: '#b3b6bd', paddingLeft: 5 }}
                            underlineColorAndroid="transparent"
                            autoCapitalize="characters"
                            keyboardType={'default'}
                            onChangeText={code => this.props.setRegisterCode(code)}
                            onFocus={() => this.onFocus(3)}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'stretch', width: '100%' }}>
                        <View style={{ alignItems: 'flex-start', width: '50%', paddingHorizontal: 20, paddingVertical: 10}}>
                            <TouchableOpacity onPress={() => {this.props.closePurchase();}}>
                                <Text style={styles.purchaseDialogButton}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: '50%', paddingHorizontal: 20, paddingVertical: 10}}>
                            <TouchableOpacity onPress={() => {this.props.attemptRegister(this.props.email, this.props.registerPassword, this.props.registerCode, this.props.mailchimpSubscription)}}>
                                <Text style={styles.purchaseDialogButton}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }
}

function bindAction(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
        popRoute: key => dispatch(popRoute(key)),
        attemptCredentialUser: key => dispatch(attemptCredentialUser(key)),
        setRegisterEmail: email => dispatch(setRegisterEmail(email)),
        setRegisterCode: code => dispatch(setRegisterCode(code)),
        setRegisterPassword: pass => dispatch(setRegisterPassword(pass)),
        attemptRegister: (email, password, code, mailchimpSubscription) => dispatch(attemptRegister(email, password, code, mailchimpSubscription)),
    };
}

function mapStateToProps(state) {
    const { attempting, error, email, registered, registerCode, registerPassword, mailchimpSubscription } = state.RegisterReducer;
    const navigation = state.cardNavigation;
    const credential = state.credential;

    return { attempting, error, email, registered, registerCode, registerPassword, mailchimpSubscription, navigation, credential };
}

export default connect(mapStateToProps, bindAction)(PurchaseRegisterDialog);
