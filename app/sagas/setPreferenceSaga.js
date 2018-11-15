import { take, put, call } from 'redux-saga/effects';
import { actions } from 'react-native-navigation-redux-helpers';
import Types from '../actions/ActionTypes';
import { packsAttempt } from '../actions/packsActions';

export default () => {
  function* watcher() {
    while (true) {
      const { key } = yield take(Types.SET_PREFERENCE);
      if (key === 'language') {
        yield put(packsAttempt());
      }
    }
  }

  return {
    watcher,
  };
};
