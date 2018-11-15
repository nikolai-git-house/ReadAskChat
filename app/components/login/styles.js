import { Colors, Metrics } from '@theme/';
import { scaleByVertical, scale } from '../../scaling/utils';

const React = require('react-native');

const { StyleSheet, Platform } = React;

module.exports = StyleSheet.create({
  headerView: {
    height: Metrics.headerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.brandPrimary,
  },
  headerViewLogo: {
    width: Metrics.screenWidth * 0.33,
    height: Metrics.screenheaderHeight,
  },
  loginButtonText: {
    color: Colors.brandSecondary,
    fontSize: scaleByVertical(17),
    lineHeight: Math.ceil(scaleByVertical(23)),
  },
  downloadButtonM: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    shadowOpacity: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
