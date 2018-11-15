import { fork } from 'redux-saga/effects';
import api from '../services/Api';
import Analytics from '../services/Analytics';

import Credential from './credential';
import ForgotPasswordSaga from './ForgotPasswordSaga';
import SetPasswordSaga from './SetPasswordSaga';
import SetTokenSaga from './setTokenSaga';
import SetPreferenceSaga from './setPreferenceSaga';
import PacksSaga from './packsSaga';
import PacksDownloadSaga from './packDownloadSaga';
import SyncAllSaga from './syncAllSaga';
import SyncOnlineContentSaga from './syncOnlineContentSaga';
import EventViewPageSaga from './EventViewPageSaga';
import StartupSaga from './StartupSaga';
import PromoCode from './promo';

const analytics = new Analytics();

export default function* rootSaga() {
  yield fork(SyncAllSaga(api).watcher);
  yield fork(SyncOnlineContentSaga(api).watcher);
  yield fork(PromoCode(api).watcher);
  yield fork(Credential(api).watcher);
  yield fork(ForgotPasswordSaga(api).watcher);
  yield fork(SetPasswordSaga(api).watcher);
  yield fork(SetTokenSaga(api).watcher);
  yield fork(SetPreferenceSaga(api).watcher);
  yield fork(PacksSaga(api).watcher);
  yield fork(PacksDownloadSaga(api).watcher);
  yield fork(EventViewPageSaga(analytics).watcher);
  yield fork(StartupSaga(analytics).watcher);
}
