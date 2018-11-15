import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Image, StyleSheet ,Dimensions} from 'react-native';
import { Button, Radio } from 'native-base';
import { connect } from 'react-redux';
import RadioButton from 'react-native-radio-button';
import { Metrics, Styles, Images } from '@theme/';
import styles from './styles';
import { applyCoupon, purchaseSubscription } from '../../actions/Creators';
import { scaleByVertical, scale } from '../../scaling/utils';
import UnlockDialog from './unlockDialog';
import PurchaseRegisterDialog from './purchaseRegisterDialog';
import PropTypes from 'prop-types';
import { actions } from 'react-native-navigation-redux-helpers';
import account from '../setting/account';


const { height } = Dimensions.get('window');
const {
  replaceAt,
  popRoute
} = actions;
class Purchase extends React.Component {
  static propTypes = {
    popRoute: PropTypes.func,
    navigation: PropTypes.shape({
        key: PropTypes.string,
    }),
    replaceAt: PropTypes.func,
    navigateTo: PropTypes.func,
};
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
      coupon: '',
      selectedPlan: 2,
      purchaseData: {
        product: null,
        index: null,
      }
    };
  }
  // componentDidMount() {
  //   if (this.props.loggedIn) {
  //     this.replaceRoute('home');
  //   }
  // }

  // replaceRoute(route) {
  //   this.props.replaceAt('login', { key: route }, 'global');
  // }

  // register() {
  //   this.replaceRoute('home');
  // }

  unlockPurchase = () => {
    const { product, index } = this.state.purchaseData;
    this.props.purchase(product, index);
    this.unlockDialog.closeDialog();
    this.props.dismissPurchase();
  };
  closePurchaseRegisterDialog = () => {
      this.purchaseRegisterDialog.closeDialog();
  };
  purchase = (product, index) => {
    if (this.props.is_logged_in) {
      if (Platform.OS === 'ios') {
          this.setState({
              purchaseData: {product, index},
          });
          this.unlockDialog.openDialog();
      } else {
          this.props.purchase(product, index);
          this.props.dismissPurchase();
      }
    } else {
      this.purchaseRegisterDialog.openDialog();
    }
  };

  // move(){
  //   this.props.navigateTo('purchase','login');
  // }

  render() {
    const { selectedPlan } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: (Metrics.screenWidth * 3) / 4, padding: 15, justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: Metrics.screenHeight / 20 }}>Purchase Subscription</Text>
            <Text style={{ fontSize: scaleByVertical(14), fontWeight: '600', marginTop: scaleByVertical(15) }}>Subscribe to access the full ReadAskChat library.</Text>
            <Text style={styles.purchaseText}>The launch library includes 24 beautifully illustrated stories, songs, poems, and math and science features.</Text>
            <Text style={styles.purchaseText}>One-year subscribers receive a new story pack bimonthly for a total of 36 stories.</Text>
            <Text style={styles.purchaseText}>Each page includes conversation starters for three age levels, so story time changes as your child grows.</Text>
            <TouchableOpacity onPress={() => this.setState({ selectedPlan: 2 })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleByVertical(15) }}>
                {/*<Radio*/}
                  {/*selected={this.state.selectedPlan === 2}*/}
                  {/*onPress={() => this.setState({ selectedPlan: 2 })}*/}
                {/*/>*/}
                <RadioButton
                    anmation={'bounceIn'}
                    size={13}
                    innerColor={'#999999'}
                    outerColor={'#999999'}
                    isSelected={this.state.selectedPlan === 2}
                    onPress={() => this.setState({ selectedPlan: 2})}
                  />
                <Text style={styles.radioText}>
                  {`$${this.props.couponValues[2][Object.keys(this.props.couponValues[2])[0]]}`}
                </Text>
                <Text style={styles.priceText}>
                  1 YEAR
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: scaleByVertical(12), marginLeft: scale(18), color: '#1e398f' }}>Receive a new story pack bimonthly!</Text>
            <TouchableOpacity onPress={() => this.setState({ selectedPlan: 0 })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleByVertical(20) }}>
                <RadioButton
                    anmation={'bounceIn'}
                    size={13}
                    innerColor={'#999999'}
                    outerColor={'#999999'}
                    isSelected={this.state.selectedPlan === 0}
                    onPress={() => this.setState({ selectedPlan: 0})}
                />
                <Text style={styles.radioText}>
                  {`$${this.props.couponValues[0][Object.keys(this.props.couponValues[0])[0]]}`}
                </Text>
                <Text style={styles.priceText}>
                  1 MONTH
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Button
            style={[Styles.buttonRadius, styles.purcharseButton]}
            disabled={selectedPlan === null}
            onPress={() => {
              this.props.is_logged_in ?
              alert('Perform action to move to the desired screen')
              //this.props.navigation(this.props.navigation('verify-account'))
              //this.register()
              // props.verify-account()
             // props.verify()
             //this.navigateTo()
             //this.props.verify-account()
            //this.props.replaceAt('purchase', { key: 'home' }, 'global')
              //this.props.popRoute('purchase', { key: 'home' }, 'global')
              //alert('move to login screen')
              //this.props.attemptRegister(this.props.email, this.props.registerPassword, this.props.registerCode, this.props.mailchimpSubscription)
              :
              this.purchase(Object.keys(this.props.couponValues[selectedPlan])[0], selectedPlan)
            }}
          >
            <Text style={styles.purcharseButtonText}>SUBSCRIBE</Text>
          </Button>
        </View>
        <View style={{ justifyContent: 'space-between' }}>
          <Image source={Images.animal1} style={styles.image} />
          <Image source={Images.animal2} style={styles.image} />
          <Image source={Images.animal3} style={styles.image} />
          <Image source={Images.animal4} style={styles.image} />
        </View>
        <TouchableOpacity
          onPress={this.props.dismissPurchase}
          style={{ position: 'absolute', top: 15, right: 15 }}
        >
          <Image source={Images.closeIcon} style={{ height: 45, width: 45 }} />
        </TouchableOpacity>
        <UnlockDialog
          reference={(dialog) => { this.unlockDialog = dialog }}
          onUnlock={this.unlockPurchase}
          totalLocks={3}
        />
        <PurchaseRegisterDialog
          width={Metrics.screenWidth / 2}
          height={Metrics.screenWidth / 2.6}
          onReference={(id) => { this.purchaseRegisterDialog = id; }}
          closePurchase={() => this.closePurchaseRegisterDialog()}
        />
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    applyCoupon: coupon => dispatch(applyCoupon(coupon)),
    purchase: (subscrition, index) => dispatch(purchaseSubscription(subscrition, index)),
   // attemptRegister: (email, password, code, mailchimpSubscription) => dispatch(attemptRegister(email, password, code, mailchimpSubscription)),
  };
}

function mapStateToProps(state) {
  const { couponValues, couponCode, is_logged_in } = state.credential;
  return { couponValues, couponCode, is_logged_in };
}

export default connect(mapStateToProps, bindAction)(Purchase);