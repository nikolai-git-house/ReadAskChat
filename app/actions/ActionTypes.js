import { createTypes } from 'reduxsauce';

export default createTypes(`
  SET_EMAIL
  SET_PASSWORD
  LOGIN_ATTEMPT
  LOGIN_SUCCESS
  LOGIN_FAILURE
  CHECK_LOGGED_IN
  LOGOUT
  RESET_PASSWORD
  SET_RESET_STATUS
  SET_REGISTER_SUBSCRIPTION

  SET_REGISTER_EMAIL
  REGISTER_ATTEMPT
  REGISTER_SUCCESS
  REGISTER_FAILURE

  SET_COPYRIGHT

  APPLY_COUPON
  SET_COUPON
  PURCHASE_SUBSCRIPTION
  SET_DEFAULT_PRICE

  SET_ACCOUNT_EMAIL
  SET_ACCOUNT_PASSWORD
  SET_PASSWORD_ATTEMPT
  SET_PASSWORD_SUCCESS
  SET_PASSWORD_FAILURE
  CLEAR_SET_PASSWORD
  SET_REGISTER_CODE
  SET_REGISTER_PASSWORD
  RESEND_VERIFICATION

  SET_FORGOT_EMAIL
  FORGOT_PASSWORD_ATTEMPT
  FORGOT_PASSWORD_SUCCESS
  FORGOT_PASSWORD_CLEAR
  FORGOT_PASSWORD_FAILURE

  CREDENTIAL_EMAIL
  CREDENTIAL_PASSWORD
  CREDENTIAL_TOKEN
  CREDENTIAL_USER
  ATTEMPT_CREDENTIAL_USER 
  CREDENTIAL_LOGGED_IN
  SET_FIRST_TIME

  OPEN_DRAWER
  CLOSE_DRAWER
  
  PACKS_ATTEMPT
  PACKS_RESET
  PACKS_SUCCESS
  PACKS_FAILURE
  PACKS_DOWNLOAD
  PACKS_DOWNLOAD_DONE
  CHECK_LOCKED_PACKS

  CHANGE_CONNECTION
  SET_PREFERENCE
  SYNC_ALL
  SYNC_ONLINE_CONTENT
  SYNC_PROGRESS
  SYNC_DONE
  SYNC_FAIL
  HIDE_COMPLETE_LABEL
  STARTUP_APP
  VIEW_PACK
  CLOSE_PACK
  SWIPE_PAGE
  CONVERSATION_OPEN
  CONVERSATION_CLOSE

  ATTEMPT_PROMO_CODE
  PROMO_CODE_SUCCESS
  PROMO_CODE_ERROR
  PROMO_CODE_CLEAR

  ATTEMPT_TIMESTAMP
  TIMESTAMP_SUCCESS
  TIMESTAMP_ERROR

  GOAL_FREQUENCY
`);