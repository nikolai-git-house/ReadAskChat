import constants from './constants';

export const scale = (value, width = constants.width) => (width / 667) * value;
export const scaleByVertical = (value, height = constants.height) => (height / 375) * value;
