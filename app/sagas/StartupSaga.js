import { takeLatest, call, select, put } from 'redux-saga/effects';
import Types from '../actions/ActionTypes';
import { attemptCredentialUser, attemptTimeStamp } from '../actions/Creators';


export default (analytics) => {
  const credential = state => state.credential;
  function* worker() {
    const account = yield select(credential);
    if (account.is_logged_in) {
      yield call(analytics.setCredential, account.email);
      yield put(attemptCredentialUser());
      yield put(attemptTimeStamp());
    }
  }

  function* watcher() {
    yield [
      takeLatest(Types.STARTUP_APP, worker),
    ];
  }

  return {
    watcher,
    worker,
  };
};
