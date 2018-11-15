import { Colors, Metrics } from '@theme/';

const React = require('react-native');

const { StyleSheet, Platform, Dimensions } = React;

const { height, width } = Dimensions.get('window');

module.exports = StyleSheet.create({
  headerView: {
    height: Metrics.headerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.brandPrimary,
  },
  headerViewLogo: {
    width: Metrics.screenWidth * 0.33,
    height: Metrics.headerHeight,
  },
  textInput: {
    marginHorizontal: 5,
    padding: height < 768 ? 0 : 8,
    borderColor: 'grey',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: Metrics.screenWidth / 32,
    paddingTop: height < 768 ? 0 : Metrics.doubleBasePadding,
    paddingLeft: Metrics.doubleBasePadding,
    lineHeight: 36,
  },
  agreeButton: {
    width: Metrics.screenWidth / 7,
    flex: 1,
    marginTop: 5,
    marginRight: 20,
    shadowOpacity: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: Metrics.doubleBasePadding
  }
});
