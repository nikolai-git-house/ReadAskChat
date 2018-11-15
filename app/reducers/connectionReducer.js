import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  connectionState: '',
});

const change = (state, action) => ({
  ...state,
  connectionState: action.connectionState,
});

const ACTION_HANDLERS = {
  [Types.CHANGE_CONNECTION]: change,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
