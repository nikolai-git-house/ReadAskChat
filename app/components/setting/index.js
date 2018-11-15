import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Image, ImageBackground, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { List, ListItem, Icon, Right, Body } from 'native-base';
import PopupDialog, { SlideAnimation, TextInput } from 'react-native-popup-dialog';
import navigateTo from '@actions/sideBarNav';

import { Styles, Images, Metrics, Colors } from '@theme/';
import styles from './styles';

import Language from './language';
import About from './about';
import WatchVideo from './watchVideo';
import DevLevel from './devLevel';
import NewRegister from './newRegister';
import DownloadSync from './downloadSync';
import Swipe from './swipe';
import PromoCodeDialog from './account/promo';
import ResetPassword from './account/reset';
import Notifications from './notifications';

const {
  replaceAt,
  popRoute,
} = actions;


class Setting extends Component {  // eslint-disable-line
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
      selectIndex: 1,
    };
  }
  onBack() {
    const { isDownloading } = this.props;
    if (!isDownloading) {
      this.popRoute();
    } else {
      Alert.alert('Sync is in progress. Please wait for it to complete');
    }
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
  getItem = (index) => {
    this.setState({ selectIndex: index });
  }
  render() {
    console.log(this.props);
    let rightView = null;
    if (this.state.selectIndex === 1) {
        rightView = (
            <NewRegister
                onPromoCode={() => this.promoDialog.show()}
                onForgotPassword={() => this.forgotDialog.show()}
            />);
    } else if (this.state.selectIndex === 2) {
      rightView = <WatchVideo />;
    } else if (this.state.selectIndex === 3) {
        rightView = <DevLevel />;
    } else if (this.state.selectIndex === 4) {
      rightView = <DownloadSync />;
    } else if (this.state.selectIndex === 5) {
        rightView = <Language/>;
    } else if (this.state.selectIndex === 6) {
        rightView = <Notifications />;
    } else if (this.state.selectIndex === 7) {
      rightView = <Swipe />;
    } else if (this.state.selectIndex === 8) {
      rightView = <About />;
    }

    return (
      <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandSecondary }]}>
        <View style={styles.headerView}>
          <Image source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
          <View style={[Styles.center, styles.headerTitleView]}>
            <Text style={{ fontSize: Metrics.screenWidth / 40 }}>Settings</Text>
          </View>
          <View style={[Styles.right, styles.headerButtonView]}>
            <TouchableOpacity onPress={() => this.onBack()}>
              <View style={[Styles.center, { flexDirection: 'row' }]}>
                <Image
                  source={Images.bookIcon}
                  resizeMode={'stretch'}
                  style={{ width: Metrics.headerHeight * 0.7, height: Metrics.headerHeight * 0.4 }}
                />
                <Text style={{ color: Colors.titlePrimary, margin: Metrics.baseMargin, marginRight: Metrics.baseMargin * 2, fontSize: Metrics.screenWidth / 50 }}>Library</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ImageBackground source={Images.launchScreen} style={{ flex: 1, width: null, height: null }}>
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 20, marginHorizontal: 20, backgroundColor: Colors.brandSecondary }}>
            <ScrollView style={{ flex: 1 }}>
              <List style={{ flex: 1 }}>
                { this.state.selectIndex === 1 ?
                    <ListItem icon button onPress={() => this.getItem(1)} style={styles.selectedItem}>
                        <Body>
                        <Text style={styles.menuText}>Registration</Text>
                        </Body>
                        <Right>
                            <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                        </Right>
                    </ListItem> :
                    <ListItem button onPress={() => this.getItem(1)}>
                        <Text style={styles.menuText}>Registration</Text>
                    </ListItem>
                }
                { this.state.selectIndex === 2 ?
                    <ListItem icon button onPress={() => this.getItem(2)} style={styles.selectedItem}>
                        <Body>
                        <Text style={styles.menuText}>Watch Video</Text>
                        </Body>
                        <Right>
                            <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                        </Right>
                    </ListItem> :
                    <ListItem button onPress={() => this.getItem(2)}>
                        <Text style={styles.menuText}>Watch Video</Text>
                    </ListItem>
                }
                { this.state.selectIndex === 3 ?
                  <ListItem icon button onPress={() => this.getItem(3)} style={styles.selectedItem}>
                    <Body>
                      <Text style={styles.menuText}>Developmental Level</Text>
                    </Body>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                    </Right>
                  </ListItem> :
                  <ListItem button onPress={() => this.getItem(3)}>
                    <Text style={styles.menuText}>Developmental Level</Text>
                  </ListItem>
                }
                { this.state.selectIndex === 4 ?
                  <ListItem icon button onPress={() => this.getItem(4)} style={styles.selectedItem}>
                    <Body>
                      <Text style={styles.menuText}>Download & Sync</Text>
                    </Body>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                    </Right>
                  </ListItem> :
                  <ListItem button onPress={() => this.getItem(4)}>
                    <Text style={styles.menuText}>Download & Sync</Text>
                  </ListItem>
                }
                { this.state.selectIndex === 5 ?
                  <ListItem icon button onPress={() => this.getItem(5)} style={styles.selectedItem}>
                    <Body>
                      <Text style={styles.menuText}>Language</Text>
                    </Body>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                    </Right>
                  </ListItem> :
                  <ListItem button onPress={() => this.getItem(5)}>
                    <Text style={styles.menuText}>Language</Text>
                  </ListItem>
                }
                { this.state.selectIndex === 6 ?
                    <ListItem icon button onPress={() => this.getItem(6)} style={styles.selectedItem}>
                        <Body>
                        <Text style={styles.menuText}>Notifications</Text>
                        </Body>
                        <Right>
                            <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                        </Right>
                    </ListItem> :
                    <ListItem button onPress={() => this.getItem(6)}>
                        <Text style={styles.menuText}>Notifications</Text>
                    </ListItem>
                }
                { this.state.selectIndex === 7 ?
                  <ListItem icon button onPress={() => this.getItem(7)} style={styles.selectedItem}>
                    <Body>
                      <Text style={styles.menuText}>Page Turns</Text>
                    </Body>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                    </Right>
                  </ListItem> :
                  <ListItem button onPress={() => this.getItem(7)}>
                    <Text style={styles.menuText}>Page Turns</Text>
                  </ListItem>
                }
                { this.state.selectIndex === 8 ?
                  <ListItem iconRight button onPress={() => this.getItem(8)} style={styles.selectedItem}>
                    <Body>
                      <Text style={styles.menuText}>About the App</Text>
                    </Body>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{ color: Colors.textThird }} />
                    </Right>
                  </ListItem> :
                  <ListItem button onPress={() => this.getItem(8)}>
                    <Text style={styles.menuText}>About the App</Text>
                  </ListItem>
                }
              </List>
            </ScrollView>
            <ScrollView style={{ flex: 1, paddingHorizontal: Metrics.doubleBaseMargin }}>
              {rightView}
            </ScrollView>
          </View>
        </ImageBackground>
        {this.renderResetDialog()}
        {this.renderPromoDialog()}
      </View>
    );
  }
  renderResetDialog() {
    return (
      <PopupDialog
        ref={dialog => this.forgotDialog = dialog}
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        width={Metrics.screenWidth / 2.1}
        height={Metrics.screenHeight / 1.8}
      >
        <ResetPassword onClose={() => this.forgotDialog.dismiss()} />
      </PopupDialog>
    );
  }
  renderPromoDialog() {
    return (
      <PopupDialog
        ref={(dialog) => { this.promoDialog = dialog; }}
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        width={Metrics.screenWidth / 2.1}
        height={Metrics.screenHeight / 1.8}
      >
        <PromoCodeDialog onClose={() => this.promoDialog.dismiss()} />
      </PopupDialog>
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
  isDownloading: state.sync.isDownloading,
});

export default connect(mapStateToProps, bindAction)(Setting);
