import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  error: null,
  email: '',
  password: '',
  attempting: false,
  done: false,
});

const setPassword = (state, { password }) => ({
  ...state,
  password,
});
const setEmail = (state, { email }) => ({
  ...state,
  email,
});

const attemptChangePassword = (state, { email, password }) => ({
  ...state,
  email,
  password,
});

const changePasswordSuccess = (state, action) => ({
  ...state,
  attempting: false,
  error: null,
  user: action.user,
  registered: true,
});

const changePasswordFailure = (state, action) => ({
  ...state,
  attempting: false,
  error: action.error,
});

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.SET_ACCOUNT_PASSWORD]: setAccountPassword,
  [Types.SET_ACCOUNT_EMAIL]: setAccountEmail,
  [Types.ATTEMPT_SET_PASSWORD]: attemptSetPassword,
  [Types.SET_PASSWORD_SUCCESS]: setPasswordSuccess,
  [Types.SET_PASSWORD_FAILURE]: setPasswordFailure,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
