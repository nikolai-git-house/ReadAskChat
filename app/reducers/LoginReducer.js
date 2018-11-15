import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  user: { email: '', password: '' },
  loggedIn: false,
  error: null,
  attempting: false,
});

const attempt = (state, action) => ({
  ...state,
  attempting: true,
});
const setEmail = (state, action) => ({
  ...state,
  user: { ...state.user, email: action.email },
  error: null,
});

const setPassword = (state, action) => ({
  ...state,
  user: { ...state.user, password: action.password },
  error: null,
});

const success = (state, action) => ({
  ...state,
  attempting: false,
  error: null,
  user: action.user,
  loggedIn: true,
});

const failure = (state, action) => ({
  ...state,
  attempting: false,
  error: action.error,
});

const logout = (state, action) => ({
  user: null,
  loggedIn: false,
});

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.LOGIN_ATTEMPT]: attempt,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.SET_EMAIL]: setEmail,
  [Types.SET_PASSWORD]: setPassword,
  [Types.LOGOUT]: logout,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
