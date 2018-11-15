import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  packs: [],
  error: null,
  attempting: false,
  downloadPacks: [],
  start_pack: 0,
  end_pack: 0,
  start_page: 0,
  end_page: 0,
  duration_pack: 0,
  duration_page: 0,
  previous_page: 0,
  conversation_start: 0,
  conversation_duration: 0,
});

const attempt = (state, action) => ({
  ...state,
  attempting: true,
});

const success = (state, action) => ({
  ...state,
  attempting: false,
  error: null,
  packs: action.packs,
});

const reset = (state, action) => ({
  ...state,
  attempting: false,
  error: null,
  packs: [],
});

const failure = (state, action) => ({
  ...state,
  attempting: false,
  packs: [],
  error: action.error,
});

const downloadPacks = (state, action) => ({
  ...state,
  downloadPacks: action.packs,
});
const downloadDone = (state, action) => ({
  ...state,
  downloadedPacks: action.packs,
});
const viewPack = (state, action) => ({
  ...state,
  start_pack: action.start,
  pack_id: action.pack_id,
  page_id: 0,
});
const closePack = (state, action) => ({
  ...state,
  end_pack: new Date().getTime(),
  duration_pack: new Date().getTime() - state.start_pack,
  pack_id: action.pack_id,
});

const swipePage = (state, action) => ({
  ...state,
  previous_page: state.page_id,
  duration_page: new Date().getTime() - state.start_page,
  end_page: new Date().getTime(),
  story_id: action.story_id,
  page_id: action.page_id,
  start_page: new Date().getTime(),
  duration_pack: state.end_pack - state.start_pack,
  pack_id: action.pack_id,
});

const conversationOpen = state => ({
  ...state,
  conversation_start: new Date().getTime(),
});
const conversationClose = state => ({
  ...state,
  conversation_duration: new Date().getTime() - state.conversation_start,
});
// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.PACKS_ATTEMPT]: attempt,
  [Types.PACKS_SUCCESS]: success,
  [Types.PACKS_FAILURE]: failure,
  [Types.PACKS_RESET]: reset,
  [Types.PACKS_DOWNLOAD]: downloadPacks,
  [Types.PACKS_DOWNLOAD_DONE]: downloadDone,
  [Types.VIEW_PACK]: viewPack,
  [Types.CLOSE_PACK]: closePack,
  [Types.SWIPE_PAGE]: swipePage,
  [Types.CONVERSATION_OPEN]: conversationOpen,
  [Types.CONVERSATION_CLOSE]: conversationClose,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
