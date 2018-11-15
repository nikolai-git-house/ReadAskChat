import Types from './ActionTypes';

export const packsAttempt = () =>
  ({ type: Types.PACKS_ATTEMPT });

export const packsSuccess = packs =>
  ({ type: Types.PACKS_SUCCESS, packs });

export const packsFailure = error =>
  ({ type: Types.PACKS_FAILURE, error });

