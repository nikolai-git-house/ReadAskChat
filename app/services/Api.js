import apisauce from 'apisauce';
import qs from 'qs';
import {
  BASE_API_DEV,
  BASE_API_PROD,
  REGISTER_EMAIL,
  CHANGE_PASSWORD,
  SET_PASSWORD,
  ACCOUNT_PROFILE,
  RESET_PASSWORD,
  API_KEY_DEV,
  API_KEY_PROD,
  FIND_PACK,
  USER_LOGIN,
  REDEEM_PROMO_CODE,
  PACKS_ALL,
  API_TIMESTAMP,
  ACCOUNT_GOAL,
  RESEND_MAIL,
  GET_COPYRIGHT,
  APPLY_COUPON,
  REDEEM_COUPON,
  CREATE_REDEEM,
} from '../Constants';

const PROD = false;
const APIparams = {
  url: PROD ? BASE_API_PROD : BASE_API_DEV,
  apiKey: PROD ? API_KEY_PROD : API_KEY_DEV,
};

class Api {
  constructor(baseURL, apiKey) {
    this.instance = apisauce.create({
      baseURL,
      headers: {
        'X-AUTH-TOKEN': apiKey,
      },
      timeout: 5000,
    });
    this.authorizationToken = '';
    this.config = {
      headers: {},
    };
    this.getPacks = this.getPacks.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getPack = this.getPack.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.resendMail = this.resendMail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getStamps = this.getStamps.bind(this);
    this.applyPromoCode = this.applyPromoCode.bind(this);
    this.getCopyRight = this.getCopyRight.bind(this);
    this.applyCoupon = this.applyCoupon.bind(this);
    this.redeemCoupon = this.redeemCoupon.bind(this);
    this.createRedeem = this.createRedeem.bind(this);
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
    const klass = this;
    methods.map((method) => {
      const verb = method.toLowerCase();
      klass[verb] = function (...args) {
        return this.instance[verb](...args);
      };
      klass[verb] = klass[verb].bind(this);
      return method;
    });
  }
  setToken(token) {
    this.authorizationToken = token;
    this.config.headers['X-AUTHORIZATION'] = token;
    this.instance.setHeader('X-AUTHORIZATION', token);
    return this;
  }

  getToken() {
    return this.authorizationToken;
  }

  formData(data) {
    this.instance.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    return qs.stringify(data);
  }
  login(email, password) {
    return this.post(USER_LOGIN, this.formData({ email, password }));
  }
  resendMail(email) {
    return this.post(RESEND_MAIL, this.formData({ email }));
  }
  register(email, password, orgcode = null, mailchimpSubscription = false) {
    return this.post(REGISTER_EMAIL, this.formData({ email, password, orgcode, mailchimpSubscription }));
  }
  setPassword({ email, password }) {
    return this.post(SET_PASSWORD, this.formData({ email, password }));
  }
  resetPassword({ email }) {
    return this.post(RESET_PASSWORD, this.formData({ email }));
  }
  changePassword({ email, password, newpassword }) {
    return this.post(CHANGE_PASSWORD, this.formData({ email, password, newpassword }));
  }

  getPacks(language = 'LL') {
    return this.get(PACKS_ALL, { language: language.toUpperCase() });
  }
  getPack(id) {
    return this.get(FIND_PACK.replace(':id', id));
  }

  saveGoal(goalFrequency) {
    return this.post(ACCOUNT_GOAL, {}, { params: { goalFrequency } });
  }

  getProfile() {
    return this.get(ACCOUNT_PROFILE);
  }
  getStamps() {
    return this.get(API_TIMESTAMP);
  }
  applyPromoCode(orgCode) {
    return this.post(REDEEM_PROMO_CODE, {}, { params: { orgcode: orgCode } });
  }
  getCopyRight() {
    return this.get(GET_COPYRIGHT);
  }
  applyCoupon(coupon) {
    return this.get(APPLY_COUPON, { giftcode: coupon });
  }
  redeemCoupon(coupon) {
    return this.post(REDEEM_COUPON, {}, { params: { giftcode: coupon } });
  }
  createRedeem(days) {
    return this.post(CREATE_REDEEM, {}, { params: { daysToExpire: days } });
  }
}
export default new Api(APIparams.url, APIparams.apiKey);
