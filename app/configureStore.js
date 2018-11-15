
import { AsyncStorage, Platform } from 'react-native';
import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import reduxCatch from 'redux-catch';
import { actions } from 'react-native-navigation-redux-helpers';


import reducer from './reducers';
import promise from './promise';
import rootSaga from './sagas';

const {
  replaceAt,
} = actions;
const errorHandler = (error, getState, lastAction, dispatch) => {
  if (lastAction.type === 'react-native-navigation-redux-helpers/REPLACE_AT') {
    dispatch(replaceAt(getState().cardNavigation.routes[0].key, lastAction.payload.route, 'global'));
  }
};

export default function configureStore(onCompletion:()=>void):any {
  const dev = false;
  const enableLog = false;
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [thunk, promise, sagaMiddleware, reduxCatch(errorHandler)];
  if (enableLog) {
    middlewares.push(logger);
  }
  // add logger after sagaMiddleware if you want to check out the redux state change in log
  const enhancer = compose(
    applyMiddleware(...middlewares),
    devTools({
      name: 'ReadAskChat', realtime: true,
    }),
  );
  const storeEnhancer = [reducer, enhancer];
  // if (!dev) {
  //   storeEnhancer.push(autoRehydrate());
  // }
  // if things goes wrong, remove autoRehydrate part
  const store = createStore(
      reducer,
      undefined,
      enhancer
  );
  persistStore(store, null, onCompletion);

  sagaMiddleware.run(rootSaga);
  return store;
}
