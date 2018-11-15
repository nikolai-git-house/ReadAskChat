import Types from './ActionTypes';

export const attemptLogin = user =>
  ({ type: Types.LOGIN_ATTEMPT, user });
export const logout = () =>
  ({ type: Types.LOGOUT });
export const setEmail = email =>
  ({ type: Types.SET_EMAIL, email });
export const setPassword = password =>
  ({ type: Types.SET_PASSWORD, password });
export const loginSuccess = user =>
  ({ type: Types.LOGIN_SUCCESS, user });
export const loginFailure = error =>
  ({ type: Types.LOGIN_FAILURE, error });
export const resetPassword = newpassword =>
  ({ type: Types.RESET_PASSWORD, newpassword });
export const setResetStatus = (status, error, resetLoading) =>
  ({ type: Types.SET_RESET_STATUS, status, error, resetLoading });

export const setRegisterEmail = email =>
  ({ type: Types.SET_REGISTER_EMAIL, email });
export const attemptRegister = (email, password, code, mailchimpSubscription) =>
  ({ type: Types.REGISTER_ATTEMPT, email, password, code, mailchimpSubscription });
export const registerSuccess = user =>
  ({ type: Types.REGISTER_SUCCESS, user });
export const registerFailure = error =>
  ({ type: Types.REGISTER_FAILURE, error });
export const setRegisterCode = code =>
  ({ type: Types.SET_REGISTER_CODE, code });
export const clearRegisterCode = () =>
  ({ type: Types.CLEAR_REGISTER_CODE });
export const setRegisterPassword = pass =>
  ({ type: Types.SET_REGISTER_PASSWORD, pass });
export const setRegiserSubscription = () =>
  ({ type: Types.SET_REGISTER_SUBSCRIPTION });
export const resendVerification = email =>
  ({ type: Types.RESEND_VERIFICATION, email });

export const applyCoupon = coupon =>
  ({ type: Types.APPLY_COUPON, coupon });
export const setCoupon = (values, coupon) =>
  ({ type: Types.SET_COUPON, values, coupon });
export const purchaseSubscription = (subscription, index) =>
  ({ type: Types.PURCHASE_SUBSCRIPTION, subscription, index });
export const setDefaultPrice = () =>
  ({ type: Types.SET_DEFAULT_PRICE });

export const setCopyRight = text =>
  ({ type: Types.SET_COPYRIGHT, text });

export const setAccountEmail = email =>
  ({ type: Types.SET_ACCOUNT_EMAIL, email });
export const setAccountPassword = password =>
  ({ type: Types.SET_ACCOUNT_PASSWORD, password });
export const attemptSetPassword = (email, password) =>
  ({ type: Types.SET_PASSWORD_ATTEMPT, email, password });
export const clearSetPassword = () =>
  ({ type: Types.CLEAR_SET_PASSWORD });
export const setPasswordSuccess = user =>
  ({ type: Types.SET_PASSWORD_SUCCESS, user });
export const setPasswordFailure = error =>
  ({ type: Types.SET_PASSWORD_FAILURE, error });

export const setForgotEmail = email =>
  ({ type: Types.SET_FORGOT_EMAIL, email });
export const attemptForgotPassword = email =>
  ({ type: Types.FORGOT_PASSWORD_ATTEMPT, email });
export const forgotPasswordSuccess = user =>
  ({ type: Types.FORGOT_PASSWORD_SUCCESS, user });
export const forgotPasswordClear = () =>
  ({ type: Types.FORGOT_PASSWORD_CLEAR });
export const forgotPasswordFailure = error =>
  ({ type: Types.FORGOT_PASSWORD_FAILURE, error });

export const setCredentialEmail = email =>
  ({ type: Types.CREDENTIAL_EMAIL, email });
export const attemptCredentialUser = () =>
  ({ type: Types.ATTEMPT_CREDENTIAL_USER });
export const setCredentialUser = user =>
  ({ type: Types.CREDENTIAL_USER, user });
export const setCredentialToken = token =>
  ({ type: Types.CREDENTIAL_TOKEN, token });
export const setCredentialPassword = password =>
  ({ type: Types.CREDENTIAL_PASSWORD, password });
export const setCredentialLoggedIn = is_logged_in =>
  ({ type: Types.CREDENTIAL_LOGGED_IN, is_logged_in });
export const setFirstTime = first_time =>
  ({ type: Types.SET_FIRST_TIME, first_time });

export const setPreference = (key, value) =>
  ({ type: Types.SET_PREFERENCE, key, value });
export const openDrawer = () =>
({ type: Types.OPEN_DRAWER });

export const closeDrawer = () =>
({ type: Types.CLOSE_DRAWER });

export const startupApp = () =>
({ type: Types.STARTUP_APP, timestamp: new Date().getTime() });

export const changeConnection = connectionState =>
({ type: Types.CHANGE_CONNECTION, connectionState });

export const syncAll = () =>
({ type: Types.SYNC_ALL });
export const syncOnlineContent = () =>
({ type: Types.SYNC_ONLINE_CONTENT });
export const syncDone = () =>
({ type: Types.SYNC_DONE });
export const syncFail = () =>
({ type: Types.SYNC_FAIL });
export const hideCompleteLabel = () =>
({ type: Types.HIDE_COMPLETE_LABEL });
export const syncProgress = progress =>
({ type: Types.SYNC_PROGRESS, progress });
export const packDownloads = packs =>
({ type: Types.PACKS_DOWNLOAD, packs });
export const packDownloadsDone = packs =>
({ type: Types.PACKS_DOWNLOAD_DONE, packs });
export const packsAttempt = () =>
({ type: Types.PACKS_ATTEMPT });
export const packsReset = () =>
({ type: Types.PACKS_RESET });
export const checkLockedPacks = localPacks =>
({ type: Types.CHECK_LOCKED_PACKS, localPacks });
export const viewPack = pack_id =>
({ type: Types.VIEW_PACK, pack_id, start: new Date().getTime() });
export const closePack = pack_id =>
({ type: Types.CLOSE_PACK, pack_id, end: new Date().getTime() });
export const swipePage = (pack_id, story_id, page_id) =>
({ type: Types.SWIPE_PAGE, pack_id, story_id, page_id, start: new Date().getTime() });
export const conversationOpen = (pack_id, story_id, page_id) =>
({ type: Types.CONVERSATION_OPEN, pack_id, story_id, page_id, start: new Date().getTime() });
export const conversationClose = (pack_id, story_id, page_id) =>
({ type: Types.CONVERSATION_CLOSE, pack_id, page_id, end: new Date().getTime() });

export const attemptPromoCode = code =>
({ type: Types.ATTEMPT_PROMO_CODE, code });
export const promoCodeSuccess = () =>
({ type: Types.PROMO_CODE_SUCCESS });
export const promoCodeError = error =>
({ type: Types.PROMO_CODE_ERROR, error });
export const promoCodeClear = () =>
({ type: Types.PROMO_CODE_CLEAR });

export const attemptTimeStamp = () =>
({ type: Types.ATTEMPT_TIMESTAMP });

export const timeStampSuccess = ({ racstamp, actstamp }) =>
({ type: Types.ATTEMPT_TIMESTAMP, racstamp, actstamp });

export const saveGoal = ({ goalFrequency }) =>
({ type: Types.GOAL_FREQUENCY, goalFrequency });
