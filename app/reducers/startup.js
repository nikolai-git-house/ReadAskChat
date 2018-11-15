import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

const INITIAL_STATE = Immutable({
  startup: false,
  timestampe: new Date().getTime(),
});

const startup = (state, { timestamp }) =>
({ ...state, timestamp });

const ACTION_HANDLERS = {
  [Types.STARTUP_APP]: startup,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
