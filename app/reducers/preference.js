import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '../actions/ActionTypes';
import Pushwoosh from 'pushwoosh-react-native-plugin';

export const INITIAL_STATE = Immutable({
  lastSync: new Date().getTime(),
  language: 'll',
  developmentalLevel: 'baby',
  swipeEnabled: true,
  notificationEnabled: true
});

const setPreference = (state, action) => {
  if (action.key === 'developmentalLevel' && action.value === '') return ({ ...state });
  if (action.key === 'notificationEnabled') {
    if (action.value)
      Pushwoosh.register(
        (token) => {
            console.log('Registered for pushes:', token);
        },
        (error) => {
            console.error('Failed to register:', error);
        },
      );
    else
      Pushwoosh.unregister(
        () => {
            console.log('Unregistered for pushes:');
        },
        (error) => {
            console.error('Failed to unregister:', error);
        },
      );
  }
  return ({
    ...state,
    [action.key]: action.value,
  });
};

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.SET_PREFERENCE]: setPreference,
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
