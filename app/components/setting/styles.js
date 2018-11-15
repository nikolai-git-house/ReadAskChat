import { Colors, Metrics } from '@theme/';

const React = require('react-native');

const { StyleSheet } = React;

module.exports = StyleSheet.create({
  headerView: {
    height: Metrics.headerHeight,
    width: Metrics.screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.brandPrimary,
  },
  headerViewLogo: {
    width: Metrics.screenWidth * 0.33,
    height: Metrics.headerHeight,
  },
  headerTitleView: {
    width: Metrics.screenWidth * 0.33,
    height: Metrics.headerHeight,
  },
  headerButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: Metrics.screenWidth * 0.33,
    height: Metrics.headerHeight,
  },
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuText: {
    color: Colors.textSecondary,
    fontWeight: 'bold',
    fontSize: Metrics.screenWidth / 50,
    marginVertical: 10,
    paddingLeft: 10,
  },
  buttonStyle: {
    marginTop: 30,
    padding: Metrics.screenHeight * 0.01,
    marginRight: 10,
    backgroundColor: Colors.buttonPrimary,
    height: Metrics.screenHeight / 14,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  buttonAccount: {
    marginTop: 10,
    padding: Metrics.screenHeight * 0.02,
    flex: 1,
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 10,
  },
  listItem: {
    marginLeft: 0,
  },
  listItemTextTitle: {
    fontWeight: 'bold',
    fontSize: Metrics.screenWidth * 0.02,
  },
  listItemTextBody: {
    fontSize: Metrics.screenWidth * 0.025,
  },
  cancelButtonText: {
    fontSize: Metrics.screenWidth / 50,
    color: 'rgba(73,142,223,1)',
    padding: Metrics.screenWidth * 0.001,
  },
  downloadButtonText: {
    fontSize: Metrics.screenWidth / 50,
    color: Colors.brandSecondary,
  },
  cancelButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Metrics.screenWidth / 20,
    flex: 1,
    marginRight: 10,
  },
  downloadButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(73,142,223,1)',
    height: Metrics.screenWidth / 20,
    flex: 1,
    shadowOpacity: 0,
  },
  downloadButtonM: {

    backgroundColor: 'rgba(73,142,223,1)',
    height: Metrics.screenWidth / 20,
    marginRight: 5,
    marginLeft: 5,
  },
});
