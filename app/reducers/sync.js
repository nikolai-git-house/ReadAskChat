import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  isDownloading: false,
  isComplete: false,
  progress: 0,
});

const syncAll = (state, action) => ({
  ...state,
  ...action,
  isDownloading: true,
});

const syncOnlineContent = (state, action) => ({
  ...state,
  ...action,
  isDownloading: true,
});
const syncProgress = (state, action) => ({
  ...state,
  progress: action.progress,
});
const syncDone = state => ({
  ...state,
  isDownloading: false,
  isComplete: true,
  progress: 0,
});
const hideCompleteLabel = state => ({
  ...state,
  isComplete: false,
});
const syncFail = state => ({
  ...state,
  isDownloading: false,
  progress: 0,
});

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.SYNC_ALL]: syncAll,
  [Types.SYNC_ONLINE_CONTENT]: syncOnlineContent,
  [Types.SYNC_PROGRESS]: syncProgress,
  [Types.SYNC_DONE]: syncDone,
  [Types.HIDE_COMPLETE_LABEL]: hideCompleteLabel,
  [Types.SYNC_FAIL]: syncFail,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
