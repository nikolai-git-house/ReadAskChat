import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import moment from 'moment';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  is_logged_in: false,
  token: '',
  email: '',
  password: '',
  user: {
    promo: {
      code: '',
      expireAt: null,
      organization: '',
    },
    goal_frequency: '',
  },
  first_time: false,
  copyright: '',
  couponCode: null,
  couponValues: [
    {
      vlo01a: 1.99,
    },
    {
      vlo06a: 9.99,
    },
    {
      vlo12a: 14.99,
    },
  ],
  resetError: false,
  resetStatus: '',
  resetLoading: false,
});

const setUser = (state, action) => ({
  ...state,
  user: action.user,
});

const setEmail = (state, action) => ({
  ...state,
  email: action.email,
});

const setPassword = (state, action) => ({
  ...state,
});

const setToken = (state, action) => ({
  ...state,
  token: action.token,
});

const setIsLoggedIn = (state, action) => ({
  ...state,
  is_logged_in: action.is_logged_in,
  // first_time: true,
});

const setFirstTime = (state, action) => ({
  ...state,
  first_time: action.first_time,
});

const setCopyRight = (state, action) => ({
  ...state,
  copyright: action.text,
});

const setCoupon = (state, action) => ({
  ...state,
  couponValues: action.values ? action.values : INITIAL_STATE.couponValues,
  couponCode: action.coupon,
});

const setDefaultPrice = state => ({
  ...state,
  couponValues: INITIAL_STATE.couponValues,
});

const setResetStatus = (state, action) => ({
  ...state,
  resetError: action.error,
  resetStatus: action.status,
  resetLoading: action.resetLoading,
});
// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.CREDENTIAL_EMAIL]: setEmail,
  [Types.CREDENTIAL_PASSWORD]: setPassword,
  [Types.CREDENTIAL_TOKEN]: setToken,
  [Types.CREDENTIAL_USER]: setUser,
  [Types.CREDENTIAL_LOGGED_IN]: setIsLoggedIn,
  [Types.SET_FIRST_TIME]: setFirstTime,
  [Types.SET_COPYRIGHT]: setCopyRight,
  [Types.SET_COUPON]: setCoupon,
  [Types.SET_DEFAULT_PRICE]: setDefaultPrice,
  [Types.SET_RESET_STATUS]: setResetStatus,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
