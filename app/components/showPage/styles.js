import { Metrics } from '@theme';
import theme from '../../themes/base-theme';
import { scaleByVertical, scale } from '../../scaling/utils';

const React = require('react-native');

const { StyleSheet, Platform } = React;

module.exports = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomView: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    width: theme.screenWidth,
    height: theme.screenHeight / 13,
  },
  bottomButtonSpacer: {
    paddingLeft: theme.screenWidth * 0.03,
    paddingRight: theme.screenWidth * 0.03,
    paddingTop: theme.screenHeight * 0.03,
    paddingBottom: theme.screenHeight * 0.03,
  },
  bottomBackgroundContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: theme.screenHeight / 12.5,
    borderRadius: 10,
    padding: theme.screenWidth * 0.003,
  },
  playerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: theme.screenWidth * 0.01,
  },
  bottomViewButtonWrapper: {
    height: theme.screenHeight / 12.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookView: {
    backgroundColor: 'rgba(177, 186, 204, 0.6)',
    alignItems: 'center',
    borderRadius: 10,
    padding: theme.screenWidth * 0.005,
    justifyContent: 'space-between',
  },
  bottomToolView: {
    flex: 1,
    backgroundColor: 'rgba(177, 186, 204, 0.6)',
    borderRadius: 10,
    padding: theme.screenWidth * 0.005,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageView: {
    width: theme.screenWidth / 10,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  messageIcon: {
    width: theme.screenWidth / 15,
    height: theme.screenHeight / 9,
    backgroundColor: 'transparent',
    marginTop: 4,
  },
  blankPlayerIcon: {
    padding: theme.screenWidth * 0.005,
    width: theme.screenWidth / 15,
    height: theme.screenHeight / 15,
  },
  mediaIcon: {
    width: theme.screenWidth / 20,
    height: theme.screenHeight / 20,
    backgroundColor: 'transparent',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  text: {
    color: '#fff',
    fontSize: theme.screenWidth * 0.015,
    fontWeight: 'bold',
  },
  iconStyle: {
    color: 'white',
    fontSize: theme.screenWidth * 0.025,
  },
  iconTouchable: {
    paddingLeft: theme.screenWidth * 0.025,
    paddingRight: theme.screenWidth * 0.025,
    paddingTop: theme.screenHeight * 0.025,
    paddingBottom: theme.screenHeight * 0.025,
  },
  iconBook: { width: theme.screenWidth / 20, height: theme.screenHeight / 20, tintColor: '#fff', resizeMode: 'contain' },
  iconChildren: { width: theme.screenWidth / 20, height: theme.screenHeight / 20, resizeMode: 'contain' },
  iconInfo: { width: theme.screenWidth / 20, height: theme.screenHeight / 20, resizeMode: 'contain', tintColor: '#fff' },
  image: {
    flex: 1,
    width: theme.screenWidth,
  },
  textIndicatorWrapper: {
    width: theme.screenWidth / 5,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorWrapper: {
    // paddingLeft: theme.screenWidth / 85,
    // paddingRight: theme.screenWidth / 85,
    width: theme.screenWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textIndicator: {
    fontSize: scaleByVertical(18),
    color: 'white',
  },
  video: {
    width: theme.screenWidth / 3,
    height: theme.screenHeight / 3,
    position: 'absolute',
    top: 30,
    opacity: 0,
    right: 30,
  },
  popView: {
    // width: theme.screenWidth / 3,
    // height: theme.screenHeight / 3.8,
    borderRadius: 15,
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  purcharseButton: {
    alignSelf: 'center',
    borderRadius: 7,
    backgroundColor: '#1e398f',
    width: theme.screenWidth / 6.25,
    height: theme.screenWidth / 20,
  },
  purcharseButtonText: {
    fontSize: theme.screenWidth / 45,
    color: 'white',
  },
  loginButton: {
    alignSelf: 'center',
    borderRadius: 7,
    backgroundColor: '#2071CE',
    height: theme.screenWidth / 18,
    paddingHorizontal: 40,
  },
  loginButtonText: {
    fontSize: theme.screenWidth / 40,
    color: 'white',
  },
  infoDialogWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  infoDialogTitle: {
    fontSize: theme.screenWidth / 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoTextWrapper: {
    flexDirection: 'row',
  },
  infoTextTitle: {
    // fontSize: theme.screenWidth / 48,
    color: '#757575',
    lineHeight: 26,
  },
  infoDialogDesc: {
    marginTop: theme.screenHeight / 50,
    marginBottom: theme.screenHeight / 50,
  },
  infoTextValue: {
    // fontSize: theme.screenWidth / 48,
    color: '#000',
    marginLeft: 5,
    lineHeight: 26,
    paddingRight: 40,
  },
  infoDialogClose: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  closeButton: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  dismissButton: {
    width: Metrics.screenWidth / 6,
    height: Metrics.screenWidth / 20,
    shadowOpacity: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottompromptspacer: {
    paddingHorizontal: 15,
  },
  checkbox: {
    width: Platform.OS === 'ios' ? 10 : 20
  }
});
