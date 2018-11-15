import React, { Component } from 'react';
import { Platform, NetInfo, PixelRatio } from 'react-native';

const Utils = {
  getUri(uriString) {
    let retUri;
    if (Platform.OS === 'android') {
      retUri = { uri: uriString, isStatic: true };
    } else {
      retUri = { uri: uriString.replace('file://', ''), isStatic: true };
    }
    return retUri.uri;
  },
  getStringFromDate(date) {
    var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return day + '/' + month + '.' + year;
  },
  clone(obj) {
    if (obj == null || typeof obj !== 'object') return obj;
    let copy = obj.constructor();
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  },
  checkConnection() {
    return new Promise(resolve => NetInfo
      .getConnectionInfo()
      .done((reach) => {
        if (reach.toString().toLowerCase() === 'none') {
          resolve(false);
        }
        resolve(true);
      }),
    );
  },
  buttonRadius() {
    let radius;
    if(Platform.OS === 'android'){
      if(PixelRatio.get() === 1){
        radius = 2;
      } else if(PixelRatio.get() === 1.5){
        radius = 3;
      } else if(PixelRatio.get() === 2){
        radius = 4;
      } else if(PixelRatio.get() === 3){
        radius = 6;
      }
    } else {
      radius = 6;
    }
    return radius;
  }
};

export default Utils;
