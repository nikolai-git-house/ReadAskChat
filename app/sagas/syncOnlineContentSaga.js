import { take, call, put, select } from 'redux-saga/effects';
import Types from '../actions/ActionTypes';
import { packsAttempt } from '../actions/packsActions';
import { syncDone, packDownloads, setPreference } from '../actions/Creators';
import DatabaseService from '../database/DatabaseService';
import Pack from '../database/PackModel';

export default () => {
  const language = state => state.preference.language;
  const credential = state => state.credential;
  function* worker() {
    const lang = yield select(language);
    yield put(packsAttempt());
    const localPacks = DatabaseService.findAllByLanguage(lang).map(pack => parseInt(pack.pack_id, 0));
    const { packs } = yield take(Types.PACKS_SUCCESS);
    const { email } = yield select(credential);
    yield put(packDownloads(
      packs
      .filter(pack => pack.pack_status !== 'locked')
      .filter(pack => localPacks.indexOf(pack.pack_id) < 0)));
    const downloaded = yield take(Types.PACKS_DOWNLOAD_DONE);
    downloaded.packs.map((pack) => {
      pack.pack_status = 'download';
      return DatabaseService.save(new Pack(pack.pack_id, JSON.stringify(pack), false, [email]));
    });
    yield put(setPreference('lastSync', new Date().getTime()));
    yield put(syncDone());
  }

  function* watcher() {
    while (true) {
      yield take(Types.SYNC_ONLINE_CONTENT);
      yield call(worker);
    }
  }

  return {
    watcher,
    worker,
  };
};
