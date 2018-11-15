import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  error: null,
  email: '',
  attempting: false,
  registered: false,
});

const setForgotEmail = (state, action) => ({
  ...state,
  email: action.email,
});

const attemptForgotPassword = (state, action) => ({
  ...state,
  attempting: true,
});

const forgotPasswordSuccess = (state, action) => ({
  ...state,
  attempting: false,
  error: null,
  user: action.user,
  registered: true,
  done: true,
});
const forgotPasswordClear = () => ({
  ...INITIAL_STATE,
});

const forgotPasswordFailure = (state, action) => ({
  ...state,
  attempting: false,
  error: action.error,
});

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.SET_FORGOT_EMAIL]: setForgotEmail,
  [Types.FORGOT_PASSWORD_ATTEMPT]: attemptForgotPassword,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,
  [Types.FORGOT_PASSWORD_CLEAR]: forgotPasswordClear,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
