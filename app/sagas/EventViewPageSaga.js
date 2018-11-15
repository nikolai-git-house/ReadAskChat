import { takeLatest, call, select } from 'redux-saga/effects';
import { constants } from 'react-native-navigation-redux-helpers';
import Types from '../actions/ActionTypes';


export default (analytics) => {
  const preference = state => state.preference;
  const packs = state => state.packsReducer;
  const credential = state => state.credential;
  function* worker({ payload }) {
    yield call(analytics.viewPage, payload.route.key);
  }
  function* afterLogin(action) {
    yield call(analytics.login, action.email);
  }
  function* viewPack() {
    const { developmentalLevel } = yield select(preference);
    const { pack_id } = yield select(packs);
    const { email, user } = yield select(credential);
    yield call(analytics.viewPack, {
      pack_id,
      email,
      user,
      developmentalLevel,
    });
  }
  function* closePack() {
    const { developmentalLevel } = yield select(preference);
    const { pack_id, duration_pack } = yield select(packs);
    const { email, user } = yield select(credential);
    yield call(analytics.closePack, {
      pack_id,
      email,
      duration: duration_pack,
      user,
      developmentalLevel,
    });
  }
  function* swipePage() {
    const { developmentalLevel } = yield select(preference);
    const { previous_page, duration_page, pack_id, story_id } = yield select(packs);
    const { email, user } = yield select(credential);
    if (duration_page > 1000) {
      yield call(analytics.swipePage, {
        page_id: previous_page,
        story_id,
        pack_id,
        email,
        user,
        duration: duration_page,
        developmentalLevel,
      });
    }
  }
  function* conversationOpen() {
    // const { developmentalLevel } = yield select(preference);
    // const { page_id, story_id, pack_id } = yield select(packs);
    // const { email, user } = yield select(credential);
    yield this.startPromt = new Date();
    // yield call(analytics.conversationOpen, {
    //   page_id,
    //   story_id,
    //   pack_id,
    //   email,
    //   user,
    //   developmentalLevel,
    // });
  }
  function* conversationClose() {
    const { developmentalLevel } = yield select(preference);
    const { page_id, story_id, pack_id } = yield select(packs);
    const { email, user } = yield select(credential);
    const duration = new Date() - this.startPromt;
    if (duration > 300) {
      yield call(analytics.conversationClose, {
        page_id,
        story_id,
        pack_id,
        email,
        user,
        duration,
        developmentalLevel,
      });
    }
  }

  function* watcher() {
    yield [
      takeLatest(constants.REPLACE_AT, worker),
      takeLatest(constants.PUSH_ROUTE, worker),
      takeLatest(Types.CREDENTIAL_EMAIL, afterLogin),
      takeLatest(Types.VIEW_PACK, viewPack),
      takeLatest(Types.CLOSE_PACK, closePack),
      takeLatest(Types.SWIPE_PAGE, swipePage),
      takeLatest(Types.CONVERSATION_OPEN, conversationOpen),
      takeLatest(Types.CONVERSATION_CLOSE, conversationClose),
    ];
  }

  return {
    watcher,
    worker,
  };
};
