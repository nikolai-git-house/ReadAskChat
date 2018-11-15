import { actions } from 'react-native-navigation-redux-helpers';
import { closeDrawer } from './Creators';

const {
  replaceAt,
  popRoute,
  pushRoute,
} = actions;

export default function navigateTo(route, homeRoute, params = {}) {
  return (dispatch, getState) => {
    const navigation = getState().cardNavigation;
    const currentRouteKey = navigation.routes[navigation.routes.length - 1].key;

    dispatch(closeDrawer());

    if (currentRouteKey !== homeRoute && route !== homeRoute) {
      dispatch(replaceAt(currentRouteKey, { key: route, index: 1, ...params }, navigation.key));
    } else if (currentRouteKey !== homeRoute && route === homeRoute) {
      dispatch(popRoute(navigation.key));
    } else if (currentRouteKey === homeRoute && route !== homeRoute) {
      dispatch(pushRoute({ key: route, index: 1, ...params }, navigation.key));
    }
  };
}
