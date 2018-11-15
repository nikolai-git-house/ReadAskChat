import { takeLatest, call, put, select } from 'redux-saga/effects';
import Types from '../actions/ActionTypes';
import { packsSuccess, packsFailure } from '../actions/packsActions';
import { setCredentialToken, timeStampSuccess, setPreference } from '../actions/Creators';
import { OLD_BASE_URL, BASE_URL_DEV } from '@src/Constants';
import DatabaseService from '@database/DatabaseService';

export default (api) => {
  const credential = state => state.credential;
  const preference = state => state.preference;
  const packs = state => state.packsReducer;
  const stamp = state => state.stamp;
  function* worker() {
    try {
      if (api.getToken() === '' && credential.email !== '') {
        const { token } = yield select(credential);
        yield put(setCredentialToken(token));
      }
      const timeStamp = yield select(stamp);
        console.log(timeStamp);
      const apiTimeStamp = yield call(api.getStamps);
      const { racstamp, actstamp } = apiTimeStamp.data;
      console.log(apiTimeStamp.data);
      if (timeStamp.racstamp !== racstamp || timeStamp.actstamp !== actstamp) {
        const { language } = yield select(preference);
        const response = yield call(api.getPacks, language);
        console.log(response);
        yield put(timeStampSuccess(apiTimeStamp.data));
        if (response.ok) {
          const packs = response.data.packs;
            console.log(packs);
          for (let i = 0; i < packs.length; i += 1) {
            const pack = yield call(api.getPack, packs[i].pack_id);
            pack.data.pack_stories = pack.data.pack_stories.map((story) => {
              story.story_pages = story.story_pages.map((page) => {
                page.page_background = page.page_background.replace(OLD_BASE_URL, BASE_URL_DEV);
                if (!!page.page_video) {
                  page.page_video = page.page_video.replace(OLD_BASE_URL, BASE_URL_DEV);
                }
                if (!!page.page_audio) {
                  page.page_audio = page.page_audio.replace(OLD_BASE_URL, BASE_URL_DEV);
                }
                return page;
              });
              return story;
            });
            packs[i] = Object.assign(packs[i], pack.data);
            packs[i].story_thumbnails = packs[i].story_thumbnails.map(image => image.replace(OLD_BASE_URL, BASE_URL_DEV));
          }
          console.log(packs);
          yield put(packsSuccess(packs));
        } else {
          yield put(packsFailure(response.data));
        }
      } else {
        const currentPacks = yield select(packs);
        yield put(packsSuccess(currentPacks));
      }
    } catch (error) {
      yield put(packsFailure(error));
    }
  }
  function* reset() {
    yield call(DatabaseService.deleteAll);
  }
  function* checkLockedPacks(data) {
    const { localPacks } = data;
    const { email, token } = yield select(credential);
    if (api.getToken() === '') {
      yield put(setCredentialToken(token));
    }
    const { language } = yield select(preference);
    const response = yield call(api.getPacks, language);
    if (response.ok) {
      const newPacks = response.data.packs;
      localPacks.forEach(({ pack_id }) => {
        const pack = newPacks.find(p => p.pack_id === pack_id);
        if (!pack || pack.pack_status === 'locked') {
          DatabaseService.delete({ pack_id }, email);
        }
      });
      yield put(setPreference('lastSync', new Date().getTime()));
    }
  }

  function* watcher() {
    yield [
      takeLatest(Types.PACKS_ATTEMPT, worker),
      takeLatest(Types.PACKS_RESET, reset),
      takeLatest(Types.CHECK_LOCKED_PACKS, checkLockedPacks),
    ];
  }

  return {
    watcher,
    worker,
  };
};
