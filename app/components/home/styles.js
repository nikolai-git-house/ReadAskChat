import { Colors, Metrics } from '@theme/';
import { Dimensions } from 'react-native';
import { scaleByVertical, scale,verticalScale,moderateScale } from '../../scaling/utils';
import theme from "../../themes/base-theme";

const React = require('react-native');

const { StyleSheet, Platform } = React;
const { width, height } = Dimensions.get('window');


module.exports = StyleSheet.create({
  shadowStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  offlineImage: {
    width: Metrics.screenWidth / 20,
    height: Metrics.screenWidth / 20,
    marginHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: Metrics.screenWidth / 50,
    color: 'rgba(73,142,223,1)',
    padding: Metrics.screenWidth * 0.001,
  },
  downloadButtonText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Metrics.screenWidth / 50,
    color: 'white',
  },
  cancelButton: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    height: Metrics.screenWidth / 20,
    flex: 1,
    marginRight: 10,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(73,142,223,1)',
    height: Metrics.screenWidth / 20,
    flex: 1,
    shadowOpacity: 0,
  },
  bottomTransView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Metrics.screenWidth / 25,
    backgroundColor: 'rgba(68, 68, 68, 0.45)',
    padding: 5,
  },
  bottomCredit: {
    fontSize: Metrics.screenWidth / 60,
    color: 'white',
  },
  bottomHeart: {
    fontSize: Metrics.screenWidth / 37,
    color: 'white',
  },
  bottomNameText: {
    fontWeight: 'bold',
    fontSize: Metrics.screenWidth / 45,
    color: 'white',
  },
  itemImage: {
    height: (Metrics.screenWidth * 0.25 - 10),
    marginBottom: 10,
    marginHorizontal: 5,
  },
  rowBody: {
    height: Metrics.screenWidth * 0.25,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  rowTitleText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: Metrics.screenWidth * 0.025,
  },
  rowTitleIcon: {
    color: 'grey',
    fontSize: Metrics.screenWidth * 0.04,
  },
  rowTitleView: {
    height: Metrics.screenWidth * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  rowTitleArea: {
    flex: 1,
  },
  rowInfoArea: {
    flexDirection: 'row',
  },
  rowLanguage: {
    color: '#0D47A1',
    fontWeight: 'bold',
    paddingTop: 5,
    fontSize: Metrics.screenWidth * 0.020,
    marginRight: 10,
  },
  rowView: {
    height: Metrics.screenWidth * 0.3,
    backgroundColor: '#F2F2F2',
    marginTop: 20,
  },
  rowDownloadView: {
    height: Metrics.screenWidth * 0.3,
    backgroundColor: '#F2F2F2',
    marginTop: 20,
  },
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
  headerPopView: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    width: Metrics.screenWidth * 0.33,
    paddingHorizontal: 5,
  },
  headerButtonView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerButtonInner: {
    // alignItems: 'center',
    padding: Metrics.screenWidth * 0.015,
    // paddingLeft: Metrics.screenWidth * 0.05,
    paddingRight: Metrics.screenWidth * 0.05,
  },
  headerSettingButtonImage: {
    width: (Metrics.screenWidth / 15 / 1.8),
    height: (Metrics.screenWidth / 15 / 1.8),
  },
  headerLogoutButtonImage: {
    width: (Metrics.screenWidth / 15 / 1.8),
    height: (Metrics.screenWidth / 15 / 1.8),
  },
  headerPopText: {
    color: '#AAA',
    fontWeight: 'bold',
    fontSize: Metrics.screenWidth / 50,
  },
  typeSelect: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomImage: {
    width: Metrics.screenWidth,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
  },
  bottomView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Metrics.screenWidth / 4,
  },
  segmentControl: {
    fontSize: Metrics.screenWidth / 40,
    fontWeight: 'bold',
    fontFamily: 'Snell Roundhand',
  },
  purcharseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#1d66c7',
    width: Metrics.screenWidth / 5.6,
    height: Metrics.screenWidth / 20,
  },
  purcharseButtonText: {
    fontSize: Metrics.screenWidth / 50,
    // padding: Metrics.screenWidth * 0.001,
    color: 'white',
  },
  image: {
    width: Metrics.screenWidth / 4,
    height: (Metrics.screenHeight / 4) - 5,
  },
  purchaseText: {
    fontSize: scaleByVertical(14),
    marginTop: scaleByVertical(15),
  },
  radioText: {
    fontSize: scaleByVertical(20),
    color: '#1e398f',
    paddingHorizontal: 5,
    fontWeight: '300',
    marginLeft: scale(10),
  },
  priceText: {
    fontSize: scaleByVertical(20),
    color: '#1e398f',
    fontWeight: '300',
    marginLeft: scale(15),
  },
  unlockContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    width,
    height,
  },
  unlockWrapper: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    width,
    height: (height / 4) * 3,
  },
  lockImageContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  lockImageButton: {
    padding: 10,
    marginRight: 30,
  },
  lockImage: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 13,
  },
  welcomeDialogWrapper: {
    alignItems: 'center',
    backgroundColor: '#D8D9EB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    width: theme.screenWidth / 2
  },
  welcomeDialogBodyWrapper: {
      alignItems: 'center',
      padding: 20,
      paddingTop: 3
  },
  welcomeDialogTitle: {
      fontSize: theme.screenWidth / 35,
      fontWeight: 'bold',
      marginVertical: 5
  },
  welcomeDialogButton: {
      fontSize: theme.screenWidth / 35,
      fontWeight: 'bold',
      color: Colors.buttonPrimary,
      marginVertical: 5
  },
  welcomeDialogBody: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  welcomeViewLogo: {
    width: theme.screenWidth / 2 - 2,
    height: 100
  },
  purchaseDialogWrapper: {
    padding: 5,
    paddingTop: 3,
    alignItems: 'center',
    backgroundColor: '#D8D9EB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    width: theme.screenWidth / 2,
  },
  purchaseContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    width,
    height,
  },
  purchaseDialogButton: {
    fontSize: theme.screenWidth / 48,
    fontWeight: 'bold',
    color: Colors.buttonPrimary,
    marginVertical: 5,
  },
  codeConfirmViewLogo: {
    width: (theme.screenWidth / 2) - 2,
    height: scaleByVertical(100),
    transform: [{ rotateY: '180deg' }],
  },
  watchVideoWrapper: {
    flexDirection: 'row',
    padding: Metrics.doubleBasePadding,
    paddingBottom: 0,
    backgroundColor: Colors.white,
  },
  watchVideoTitle: {
    color: Colors.buttonPrimary,
    fontWeight: 'bold',
    fontSize: theme.screenWidth / 40,
    marginHorizontal: 5,
  },
  watchVideoButtonImage: {
    width: 20,
    height: 20,
    tintColor: '#464a4c',
  }
});
