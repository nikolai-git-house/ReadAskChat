import { takeLatest, call, select, put } from 'redux-saga/effects';
import Types from '../actions/ActionTypes';
import { timeStampSuccess, packsAttempt } from '../actions/Creators';


export default (api) => {
  const credential = state => state.credential;
  const stamp = state => state.stamp;
  function* worker() {
    const account = yield select(credential);
    if (account.is_logged_in) {
      const response = yield call(api.getTimeStamp);
      const timestamp = yield select(stamp);
      if (response.ok && response.data) {
        // compare the current timestamps to server timestamps
        if (timestamp.racstamp !== response.data.racstamp ||
            timestamp.actstamp !== response.data.actstamp) {
              // re-fetch the packs
          yield put(timeStampSuccess(response.data));
          yield put(packsAttempt());
        }
      }
    }
  }

  function* watcher() {
    yield [
      takeLatest(Types.ATTEMPT_TIMESTAMP, worker),
    ];
  }

  return {
    watcher,
    worker,
  };
};
