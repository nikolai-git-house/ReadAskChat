import { take, call, put } from 'redux-saga/effects';
import Types from '../actions/ActionTypes';
import {
  setPasswordFailure,
  setPasswordSuccess,
  setCredentialEmail,
  setCredentialPassword,
  setCredentialToken,
} from '../actions/Creators';


export default (api) => {
  function* worker(email, password) {
    const response = yield call(api.setPassword, { email, password });
    if (response.ok) {
      if (response.data && response.result !== 'error') {
        yield put(setPasswordSuccess(response.data));
        yield put(setCredentialEmail(email));
        yield put(setCredentialPassword(password));
        yield put(setCredentialToken(response.data.token));
      } else {
        yield put(setPasswordFailure(response.data));
      }
    } else {
      yield put(setPasswordFailure(response.data));
    }
  }

  function* watcher() {
    while (true) {
      const data = yield take(Types.SET_PASSWORD_ATTEMPT, worker);
      yield call(worker, data.email, data.password);
    }
  }

  return {
    watcher,
    worker,
  };
};
