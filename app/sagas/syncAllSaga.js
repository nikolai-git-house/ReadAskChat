import { take, call, put, select } from 'redux-saga/effects';
import { Alert } from 'react-native';
import { delay } from 'redux-saga';
import Types from '../actions/ActionTypes';
import { packsAttempt } from '../actions/packsActions';
import { syncDone, packDownloads, setPreference, hideCompleteLabel, syncFail } from '../actions/Creators';
import DatabaseService from '../database/DatabaseService';
import Pack from '../database/PackModel';
import Utils from '../utils';

const Analytics = require('react-native-firebase-analytics');

export default () => {
  const credential = state => state.credential;
  function* worker() {
    this.packs = '';
    const connection = yield Utils.checkConnection();
    if (!connection) {
      Alert.alert('No connectivity to the Internet. Please connect to the internet.');
      yield put(syncFail());
      return;
    }
    const startTime = new Date();
    yield put(packsAttempt());
    const { packs } = yield take(Types.PACKS_SUCCESS);
    yield put(packDownloads(packs.filter(pack => pack.pack_status !== 'locked')));
    const downloaded = yield take(Types.PACKS_DOWNLOAD_DONE);
    const { email } = yield select(credential);
    yield DatabaseService.deleteAll();
    downloaded.packs.map((pack) => {
      pack.pack_status = 'download';
      this.packs += `${pack.pack_id} `;
      return DatabaseService.save(new Pack(pack.pack_id, JSON.stringify(pack), false, [email]));
    });
    yield put(setPreference('lastSync', new Date().getTime()));
    yield Analytics.logEvent('download_pack', {
      packId: this.packs,
      email,
      timeDownload: new Date() - startTime,
    });
    yield put(syncDone());
    yield call(delay, 3000, true);
    yield put(hideCompleteLabel());
  }

  function* watcher() {
    while (true) {
      yield take(Types.SYNC_ALL);
      yield call(worker);
    }
  }

  return {
    watcher,
    worker,
  };
};
