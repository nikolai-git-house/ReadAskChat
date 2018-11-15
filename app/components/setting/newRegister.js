import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import {View, Text, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, List, ListItem } from 'native-base';

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

import { Styles, Metrics, Colors } from '@theme/';
import styles from './styles';

const {
    replaceAtIndex,
    popRoute,
    replaceAt
} = actions;


class NewRegister extends Component {  // eslint-disable-line
    static propTypes = {
        popRoute: PropTypes.func,
        navigation: PropTypes.shape({
            key: PropTypes.string,
        }),
        replaceAt: PropTypes.func,
        navigateTo: PropTypes.func,
    };

    componentWillMount() {
        this.props.attemptCredentialUser();
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
    forgotPassword()
    {
        this.props.replaceAt('home', { key: 'set-password' }, 'global');

    }
    hasPromoCode() {
        return this.props.credential.user.promo.code !== '';
    }

    loginOther() {
        Alert.alert('Are you sure you want to logout?', 'Logging out will remove all downloaded packs from this device. (You will be able to reload them.)', [
            { text: 'Cancel', onPress: () => {} },
            { text: 'Logout', onPress: () => this.props.loginOther() },
        ]);
    }

    renderButtons() {
        return (
            <View>
                {
                    this.props.credential.is_logged_in ?
                        <View style={[{ flexDirection: 'column', paddingBottom: Metrics.screenHeight * 0.05 }]}>
                            <TouchableOpacity
                                style={[Styles.center, styles.buttonAccount]}
                                onPress={() => this.loginOther()}
                            >
                                <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                                    Logout
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Styles.center, styles.buttonAccount]}
                                onPress={() => this.promoCode()}
                            >
                                <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                                    New Organization Code
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Styles.center, styles.buttonAccount]}
                                onPress={() => this.forgotPassword()}>
                          
                                <Text style={{ color: Colors.titleSecondary, fontSize: Metrics.screenWidth / 50 }}>
                                    Change Password
                                </Text>
                            </TouchableOpacity>
                        </View>:
                        <View style={{flexDirection: 'row', marginTop: Metrics.doubleBaseMargin, justifyContent: 'center'}}>
                            <Button
                                style={[Styles.buttonRadius, { width: '100%', marginHorizontal: 20, shadowOpacity: 0, justifyContent: 'center', flexDirection: 'row',  alignItems: 'center', }]}
                                onPress={() => this.props.attemptRegister(this.props.email, this.props.registerPassword, this.props.registerCode, this.props.mailchimpSubscription)}
                            ><Text style={{ fontSize: Metrics.screenWidth / 40, paddingBottom: 5, color: 'white' }}>Submit</Text>
                            </Button>
                        </View>
                }
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                >
                    <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Registration</Text>
                    {
                        this.props.credential.is_logged_in ?
                            <List>
                                <ListItem style={styles.listItem}>
                                    <View >
                                        <Text style={styles.listItemTextTitle}>Email</Text>
                                        <Text style={styles.listItemTextBody}>{this.props.credential.email}</Text>
                                    </View>
                                </ListItem>
                                {this.hasPromoCode() && <View><ListItem style={styles.listItem}>
                                    <View >
                                        <Text style={styles.listItemTextTitle}>Organization Code</Text>
                                        <Text style={styles.listItemTextBody}>{this.props.credential.user.promo.code}</Text>
                                    </View>
                                </ListItem>
                                    <ListItem style={styles.listItem}>
                                        <View >
                                            <Text style={styles.listItemTextTitle}>Org Code Expiration Date</Text>
                                            <Text style={styles.listItemTextBody}>{this.props.credential.user.promo.expireAt}</Text>
                                        </View>
                                    </ListItem>
                                    <ListItem style={styles.listItem}>
                                        <View >
                                            <Text style={styles.listItemTextTitle}>Organization</Text>
                                            <Text style={styles.listItemTextBody}>{this.props.credential.user.promo.organization}</Text>
                                        </View>
                                    </ListItem>
                                </View>}
                            </List>
                            :
                            <View style={{ marginTop: 10 }}>
                                {this.props.error && <View style={{ padding: 10, backgroundColor: Colors.warningPrimary }}>
                                    <Text>{this.props.error}</Text>
                                </View>}
                                <KeyboardAvoidingView
                                    style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                    behavior="padding"
                                >
                                    <Text style={{ width: '100%', fontSize: Metrics.screenWidth / 45, fontWeight: 'bold' }}>
                                        Email
                                    </Text>
                                    <TextInput
                                        style={{ width: '100%', height: Metrics.screenWidth / 20, fontSize: Metrics.screenWidth / 35, padding: 0, backgroundColor: '#ddddde' }}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                        keyboardType={'email-address'}
                                        onChangeText={text => this.props.setRegisterEmail(text)}
                                    />
                                    <Text style={{ width: '100%', fontSize: Metrics.screenWidth / 45, fontWeight: 'bold' }}>
                                        Create Password
                                    </Text>
                                    <TextInput
                                        style={{ width: '100%', height: Metrics.screenWidth / 20, fontSize: Metrics.screenWidth / 35, padding: 0, backgroundColor: '#ddddde' }}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="characters"
                                        secureTextEntry
                                        keyboardType={'default'}
                                        onChangeText={code => this.props.setRegisterPassword(code)}
                                    />
                                    <Text style={{ width: '100%', fontSize: Metrics.screenWidth / 45, fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.5)' }}>
                                        Organization Code [Optional]
                                    </Text>
                                    <TextInput
                                        style={{ width: '100%', height: Metrics.screenWidth / 20, fontSize: Metrics.screenWidth / 35, padding: 0, backgroundColor: '#ddddde' }}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="characters"
                                        keyboardType={'default'}
                                        onChangeText={code => this.props.setRegisterCode(code)}
                                    />
                                </KeyboardAvoidingView>
                            </View>
                    }
                    {this.renderButtons()}
                    {
                      !this.props.credential.is_logged_in ?
                        <View style={{ alignItems: 'center', padding: 20}}>
                          <TouchableOpacity onPress={() => {this.replaceRoute('login');}}>
                            <Text style={[styles.purchaseDialogButton, {color: Colors.titlePrimary}]}>Already registered?</Text>
                          </TouchableOpacity>
                        </View>
                        :
                        null
                    }

                </KeyboardAwareScrollView>
            </View>
        );
    }
}

NewRegister.propTypes = {
    attemptRegister: PropTypes.func,
    backLogin: PropTypes.func,
    setRegisterEmail: PropTypes.func,
};

function bindAction(dispatch) {
    return {
        replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
        navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
        popRoute: key => dispatch(popRoute(key)),
        attemptRegister: (email, password, code, mailchimpSubscription) => dispatch(attemptRegister(email, password, code, mailchimpSubscription)),
        attemptCredentialUser: key => dispatch(attemptCredentialUser(key)),
        setRegisterEmail: email => dispatch(setRegisterEmail(email)),
        setRegisterCode: code => dispatch(setRegisterCode(code)),
        setRegisterPassword: pass => dispatch(setRegisterPassword(pass)),
        loginOther: () => {
            dispatch(setCredentialLoggedIn(false));
            dispatch(setCredentialToken(''));
            dispatch(setCredentialEmail(''));
            dispatch(packsReset());
            dispatch(logout());
            dispatch(replaceAtIndex(0, { key: 'login' }, 'global'));
        },
    };
}

function mapStateToProps(state) {
    const { attempting, error, email, registered, registerCode, registerPassword, mailchimpSubscription } = state.RegisterReducer;
    const navigation = state.cardNavigation;
    const credential = state.credential;

    return { attempting, error, email, registered, registerCode, registerPassword, mailchimpSubscription, navigation, credential };
}

export default connect(mapStateToProps, bindAction)(NewRegister);
