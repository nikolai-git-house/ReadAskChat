import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  error: null,
  email: '',
  attempting: false,
  registered: false,
  registerCode: '',
  registerPassword: '',
  mailchimpSubscription: false,
});

const attempt = (state, action) => ({
  ...state,
  attempting: true,
});
const setEmail = (state, action) => ({
  ...state,
  email: action.email,
});

const success = (state, action) => ({
  ...state,
  attempting: false,
  error: null,
  user: action.user,
  registered: true,
  mailchimpSubscription: false,
});

const failure = (state, action) => ({
  ...state,
  attempting: false,
  error: action.error,
});

const setCode = (state, action) => ({
  ...state,
  registerCode: action.code,
});

const clearCode = state => ({
  ...state,
  registerCode: '',
});

const setPassword = (state, action) => ({
  ...state,
  registerPassword: action.pass,
});

const setSubscription = state => ({
  ...state,
  mailchimpSubscription: !state.mailchimpSubscription,
});

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.REGISTER_ATTEMPT]: attempt,
  [Types.REGISTER_SUCCESS]: success,
  [Types.REGISTER_FAILURE]: failure,
  [Types.SET_REGISTER_EMAIL]: setEmail,
  [Types.SET_REGISTER_CODE]: setCode,
  [Types.SET_REGISTER_PASSWORD]: setPassword,
  [Types.CLEAR_REGISTER_CODE]: clearCode,
  [Types.SET_REGISTER_SUBSCRIPTION]: setSubscription,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
