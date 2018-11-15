import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { actions } from 'react-native-navigation-redux-helpers';
import { Alert, Platform, NativeModules } from 'react-native';
import InAppBilling from 'react-native-billing';
import Types from '../actions/ActionTypes';
import Utils from '../utils';
import {
  promoCodeSuccess,
  promoCodeError,
  promoCodeClear,
  attemptCredentialUser,
  packsAttempt,
  setCoupon,
} from '../actions/Creators';

const { InAppUtils } = NativeModules;

const products = [
  'vlo01a',
  'vlo06a',
  'vlo12a',
  'low01a',
  'low06a',
  'low12a',
  'med01a',
  'med06a',
  'med12a',
  'hix01a',
  'hix06a',
  'hix12a',
];

export default (api) => {
  function* worker(promoCode) {
    const connection = yield Utils.checkConnection();
    if (!connection) {
      Alert.alert('No connectivity to the Internet. Please connect to the internet.');
      yield put(promoCodeError('No connectivity'));
      return;
    }
    yield delay(3 * 1000);
    const response = yield call(api.applyPromoCode, promoCode.code);
    if (response.ok) {
      if (response.data && response.data.result !== 'error') {
        yield put(promoCodeSuccess());
        yield put(attemptCredentialUser());
        yield delay(200);
        yield put(promoCodeClear());
        yield put(packsAttempt());
      } else {
        yield put(promoCodeError(response.data));
        yield delay(4000);
        yield put(promoCodeClear());
      }
    } else if (response.problem) {
      Alert.alert('Server is unresponsive. Please try again later.');
      yield put(promoCodeError('Server is unresponsive'));
    }
  }

  function* applyCoupon(data) {
    const connection = yield Utils.checkConnection();
    if (!connection) {
      Alert.alert('No connectivity to the Internet. Please connect to the internet.');
      return;
    }
    const response = yield call(api.applyCoupon, data.coupon);
    if (response.ok) {
      if (response.data.status === 'Valid') {
        yield put(setCoupon(response.data.values, data.coupon));
      } else if (response.problem) {
        Alert.alert('Server is unresponsive. Please try again later.');
        yield put(setCoupon(null, data.coupon));
      } else {
        yield put(setCoupon(null, data.coupon));
        Alert.alert(`${response.data.status} coupon`);
      }
    }
  }

  const doPurchaseIOS = data => new Promise((resolve, reject) =>
    InAppUtils.loadProducts(products, () => {
      InAppUtils.purchaseProduct(data.subscription.toLowerCase(), (err, response) => {
        // resolve(response);
        if (response && response.productIdentifier) {
          resolve(true);
        // Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
        } else {
          resolve(false);
        }
      });
    }),
  );

  const doPurchaseAndroid = data => new Promise((resolve, reject) =>
    InAppBilling.open().then(() => InAppBilling.purchase(data.subscription.toLowerCase()))
    .then(details => InAppBilling.getProductDetails(data.subscription.toLowerCase()))
    .then((details) => {
      resolve(true);
      return InAppBilling.close();
    })
    .catch((error) => {
      resolve(false);
      console.log(error);
    }),
  );

  function getProperNumber(num) {
    if (num === 2) {
      return 365;
    } else if (num === 1) {
      return 183;
    }
    return 30;
  }

  function* purchaseSubscription(data) {
    this.status = null;
    const credential = state => state.credential;
    const { couponCode } = yield select(credential);
    let result = null;
    if (Platform.OS === 'android') {
      InAppBilling.close();
      result = yield call(doPurchaseAndroid, data);
    } else {
      result = yield call(doPurchaseIOS, data);
    }
    if (result) {
      if (couponCode) {
        yield call(api.redeemCoupon, couponCode);
      }
      yield call(api.createRedeem, getProperNumber(data.index));
      yield put(packsAttempt());
    }
  }


  function* watcher() {
    yield takeLatest(Types.ATTEMPT_PROMO_CODE, worker);
    yield takeLatest(Types.APPLY_COUPON, applyCoupon);
    yield takeLatest(Types.PURCHASE_SUBSCRIPTION, purchaseSubscription);
  }

  return {
    watcher,
    worker,
  };
};
