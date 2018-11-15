import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';

export const INITIAL_STATE = Immutable({
  code: '',
  attempting: false,
  done: false,
  error: null,
});

const attemptPromoCode = (state, action) => ({
  ...state,
  attempting: true,
  code: action.code,
});

const promoCodeSuccess = state => ({
  ...state,
  attempting: false,
  done: true,
  error: null,
});

const promoCodeError = (state, action) => ({
  ...state,
  attempting: false,
  done: true,
  error: action.error,
});
const promoCodeClear = () => ({
  ...INITIAL_STATE,
});
// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.ATTEMPT_PROMO_CODE]: attemptPromoCode,
  [Types.PROMO_CODE_SUCCESS]: promoCodeSuccess,
  [Types.PROMO_CODE_ERROR]: promoCodeError,
  [Types.PROMO_CODE_CLEAR]: promoCodeClear,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
