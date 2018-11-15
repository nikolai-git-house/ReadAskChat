import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

const INITIAL_STATE = Immutable({
  attempting: true,
  racstamp: new Date().getTime(),
  actstamp: new Date().getTime(),
});

const attemptStamp = state =>
({ ...state, attempting: true });

const setStamp = (state, { racstamp, actstamp }) =>
({ ...state, racstamp, actstamp, attempting: null });

const ACTION_HANDLERS = {
  [Types.ATTEMPT_TIMESTAMP]: attemptStamp,
  [Types.TIMESTAMP_SUCCESS]: setStamp,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
