import { take, call, put } from 'redux-saga/effects';
import Types from '../actions/ActionTypes';
import { registerSuccess, registerFailure, setCredentialEmail, setAccountEmail } from '../actions/Creators';


export default (api) => {
  function* worker(authData) {
    const response = yield call(api.register, authData.email);
    if (response.ok) {
      if (response.data && response.result !== 'error') {
        yield put(setCredentialEmail(authData.email));
        yield put(setAccountEmail(authData.email));
        yield put(registerSuccess(response.message));
      } else {
        yield put(registerFailure(response.message));
      }
    } else {
      yield put(registerFailure(response.message));
    }
  }

  function* watcher() {
    while (true) {
      const user = yield take(Types.REGISTER_ATTEMPT);
      yield call(worker, user);
    }
  }

  return {
    watcher,
    worker,
  };
};
