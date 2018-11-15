// @flow

import { Dimensions, Platform } from 'react-native';
import Utils from '../utils';

const { width, height } = Dimensions.get('window');
const screenHeightTmp = width < height ? width : height;
const screenWidthTmp = width > height ? width : height;
const bottomMargin = 24;
// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  doubleBasePadding: 16,
  smallMargin: 5,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  screenWidth: width < height ? height : width,
  screenHeight: (Platform.OS === 'ios') ? screenHeightTmp : screenHeightTmp - bottomMargin,
  realScreenHeight: height,
  cellWidth: screenWidthTmp / 3 - 20,
  navBarHeight: (Platform.OS === 'ios') ? 44 : 64,
  navBarBottomPadding: 5,
  buttonRadius: Utils.buttonRadius(),
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 60,
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 300,
  },
  headerHeight: width / 15,
  footerHeight: width / 7,
  androidMarginBottom: bottomMargin,
  sliderThumbSize: 25,
  statusBarHeight: 20,
  circleBtnSize: 55,
};

export default metrics;
