import { delay } from 'redux-saga';
import { take, select, put, takeLatest, call } from 'redux-saga/effects';
import { actions } from 'react-native-navigation-redux-helpers';
import { Alert } from 'react-native';
import Types from '../actions/ActionTypes';
import Utils from '../utils';
import {setUser} from '../Bugsnag';

import {
  loginSuccess,
  loginFailure,
  setCredentialToken,
  setCredentialLoggedIn,
  setCredentialUser,
  setCredentialEmail,
  registerFailure,
  registerSuccess,
  setAccountEmail,
  attemptPromoCode,
  clearRegisterCode,
  setCopyRight,
  setPreference,
  setResetStatus,
  setPassword,
} from '../actions/Creators';

const {
  replaceAt,
  replaceAtIndex,
} = actions;

export default (api) => {
  const credential = state => state.credential;
  const register = state => state.RegisterReducer;
  function* registerDone(user) {
    yield put(registerSuccess(user));
    yield put(replaceAt('register', { key: 'verify-account' }, 'global'));
  }
  function* attemptUserProfile() {
    const user = yield call(api.getProfile);
    if (user.ok && user.data.organization) {
      const newUser = {
        promo: {
          code: user.data.org_code,
          expireAt: user.data.org_code_expiration,
          organization: user.data.organization,
        },
        goal_frequency: user.data.goal_frequency,
      };
      yield put(setCredentialUser(newUser));
    } else {
      yield put(setCredentialUser({
        promo: {
          code: '',
          expireAt: null,
          organization: '',
        },
        goal_frequency: '',
      }));
    }
  }
  function* loginDone(authData, response) {
    yield put(setCredentialToken(response.data.token));
    yield put(setCredentialEmail(authData.email));
    api.setToken(response.data.token);
    yield put(loginSuccess(authData));
    yield put(setCredentialLoggedIn(true));
    yield call(attemptUserProfile);
    setUser({email: authData.email});
    const copyright = yield call(api.getCopyRight);
    if (copyright.ok) {
      yield put(setCopyRight(copyright.data.copyright));
    }
    yield put(setPreference('language', 'en'));
    yield put(replaceAtIndex(0, { key: 'home' }, 'global'));
  }
  function* loginError(message) {
    yield put(loginFailure({ message }));
    yield delay(10000);
    yield put(loginFailure(null));
  }
  function* loginAttempt(authData) {
    const connection = yield Utils.checkConnection();
    if (!connection) {
      Alert.alert('No connectivity to the Internet. Please connect to the internet.');
      yield loginError('No connection');
      return;
    }
    const user = authData.user.user;
    const response = yield call(api.login, user.email, user.password);
    if (response.ok) {
      if (response.data && response.data.result !== 'error') {
        yield loginDone(authData.user.user, response);
        const { registerCode, email } = yield select(register);
        if (registerCode && email === user.email) {
          yield put(attemptPromoCode(registerCode));
          yield put(clearRegisterCode());
        }
      } else {
        yield loginError(response.data.message);
      }
    } else if (response.problem) {
      Alert.alert('Server is unresponsive. Please try again later.');
      yield loginError(response.problem);
    }
  }
  function* attemptSaveGoal(data) {
    const { goalFrequency } = data;
    const { user } = yield select(credential);
    const { goal_frequency } = user;
    user.goal_frequency = goalFrequency;
    yield put(setCredentialUser(user));
    const result = yield api.saveGoal(goalFrequency);
    if (!result.ok) {
      user.goal_frequency = goal_frequency;
      yield put(setCredentialUser(user));
      if (result.problem === 'NETWORK_ERROR') {
        Alert.alert('Can not set Goals without connectivity. Please check your connectivity.');
      }
    }
  }
  function* registerAttempt(authData) {
    const connection = yield Utils.checkConnection();
    if (!connection) {
      Alert.alert('No connectivity to the Internet. Please connect to the internet.');
      yield put(registerFailure('No connectivity to the Internet'));
      yield delay(3 * 1000);
      yield put(registerFailure(null));
      return;
    }
    if (!authData.email || !authData.password) {
      yield put(registerFailure(null));
      return;
    }
    const response = yield call(api.register, authData.email, authData.password, authData.code, authData.mailchimpSubscription);
    if (response.ok) {
      if (response.data && response.data.result !== 'error') {
        yield put(setCredentialEmail(authData.email));
        yield put(setAccountEmail(authData.email));
        yield registerDone(authData);
      } else {
        yield put(registerFailure(response.data.message));
        yield delay(7 * 1000);
        yield put(registerFailure(null));
      }
    } else if (response.problem) {
      Alert.alert('Server is unresponsive. Please try again later.');
      yield put(registerFailure('Server is unresponsive'));
      yield delay(3 * 1000);
      yield put(registerFailure(null));
    }
  }

  function* resendVerification(data) {
    const response = yield call(api.resendMail, data.email);
    if (response.ok) {
      yield Alert.alert(response.data.message);
      yield put(loginFailure(null));
    }
  }

  function* resetPassword(data) {
    const creds = state => state.LoginReducer;
    const { user } = yield select(creds);
    yield put(setResetStatus('', false, true));
    const response = yield call(api.changePassword, { ...data, email: user.email, password: user.password });
    if (response.ok && response.data.result !== 'error') {
      yield put(setResetStatus(response.data.message, false, false));
      yield put(setResetStatus('', false));
      yield put(setPassword(data.password));
    } else {
      yield put(setResetStatus(response.data.message, true, false));
      yield delay(5 * 1000);
      yield put(setResetStatus('', false));
    }
  }

  function* watcher() {
    yield [
      takeLatest(Types.LOGIN_ATTEMPT, loginAttempt),
      takeLatest(Types.REGISTER_ATTEMPT, registerAttempt),
      takeLatest(Types.REGISTER_SUCCESS, registerSuccess),
      takeLatest(Types.ATTEMPT_CREDENTIAL_USER, attemptUserProfile),
      takeLatest(Types.GOAL_FREQUENCY, attemptSaveGoal),
      takeLatest(Types.RESEND_VERIFICATION, resendVerification),
      takeLatest(Types.RESET_PASSWORD, resetPassword),
    ];
  }

  return {
    watcher,
  };
};
