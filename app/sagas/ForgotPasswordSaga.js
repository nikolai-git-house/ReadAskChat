import { delay } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import { actions } from 'react-native-navigation-redux-helpers';
import Types from '../actions/ActionTypes';
import {
  forgotPasswordFailure,
  forgotPasswordClear,
  forgotPasswordSuccess, setCredentialEmail, setAccountEmail } from '../actions/Creators';

const {
  replaceAt,
} = actions;

export default (api) => {
  function* worker(email) {
    const response = yield call(api.resetPassword, { email });
    if (response.ok) {
      if (response.data && response.data.result !== 'error') {
        yield put(forgotPasswordSuccess(response.data));
        yield put(setCredentialEmail(email));
        yield put(setAccountEmail(email));
        yield delay(4000);
        yield put(forgotPasswordClear());
      } else {
        yield put(forgotPasswordFailure(response.data));
      }
    } else {
      yield put(forgotPasswordFailure(response.data));
    }
  }

  function* watcher() {
    const data = yield take(Types.FORGOT_PASSWORD_ATTEMPT, worker);
    yield call(worker, data.email);
  }

  return {
    watcher,
    worker,
  };
};
