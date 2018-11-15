import { take, call, put } from 'redux-saga/effects';
import Types from '../actions/ActionTypes';


export default (api) => {
  function* worker(token) {
    yield api.setToken(token.token);
  }

  function* watcher() {
    while (true) {
      const token = yield take(Types.CREDENTIAL_TOKEN);
      yield call(worker, token);
    }
  }

  return {
    watcher,
    worker,
  };
};
