import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Image, ImageBackground, TouchableOpacity, Text, View, ScrollView, NetInfo, Platform, ActivityIndicator, Alert, AsyncStorage } from 'react-native';
import { Button, Icon } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import * as Progress from 'react-native-progress';
import SudokuGrid from 'react-native-smart-sudoku-grid';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

import navigateTo from '@actions/sideBarNav';
import { packsAttempt } from '@actions/packsActions';
import {
  changeConnection,
  setCredentialLoggedIn,
  setPreference,
  checkLockedPacks,
  setFirstTime,
  setCredentialEmail,
  setCredentialToken,
  packsReset,
  logout,
  syncAll,
  setDefaultPrice,
  attemptCredentialUser,
} from '@actions/Creators';

import DatabaseService from '@database/DatabaseService';
import PackModel from '@database/PackModel';
import PendingModel from '@database/PendingModel';

import styles from './styles';
import { Images, Styles, Colors, Metrics } from '@theme/';

import Global from '@src/Global';

import Intro from './intro';
import Purchase from './purchase';
import SyncDialog from './syncDialog';
import VideoDialog from './videoDialog';
import WelcomeDialog from './welcomeDialog';
import CodeConfirmDialog from './codeConfirmDialog';
import { scaleByVertical, scale } from '../../scaling/utils';

const Analytics = require('react-native-firebase-analytics');
const {
  replaceAt,
  replaceAtIndex,
} = actions;

let packData = null;
let deleteData = null;

class Home extends Component {
  static propTypes = {
    replaceAt: PropTypes.func,
    navigateTo: PropTypes.func,
    packsAttempt: PropTypes.func,
    changeConnection: PropTypes.func,
    connectionState: PropTypes.object,
    checkLockedPacks: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      connectionInfo: null,
      clickFlag: false,
      downloadPercent: 0,
      remoteData: [],
      localData: [],
      mainData: [],
      lastSync: null,
      syncOpened: false,
      showWatchVideo: false,
    };
  }
  componentWillMount() {
    this.props.attemptCredentialUser();
    this.readingLocalData();
  }
  componentDidMount() {
    NetInfo.addEventListener(
      'connectionChange',
      this.handleConnectionInfoChange,
    );
    NetInfo.getConnectionInfo().done(
      (connectionInfo) => {
        this.setState({ connectionInfo });
        this.props.changeConnection(connectionInfo);
      },
    );
    if (this.props.connectionState && ['wifi', 'mobile', 'unknown'].indexOf(this.props.connectionState.type.toString().toLowerCase()) >= 0) {
      this.props.packsAttempt();
      this.checkoutDownloadedPack();
    }
    if (this.props.packs.length > 0) {
      this.onlineData(this.props.packs);
    }
    this.props.checkLockedPacks(this.state.localData);
    if (this.props.first_time) {
      setTimeout(() => this.syncDialog.show(), 2000);
      this.setState({ syncOpened: true });
    }

    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem("alreadyLaunched", "showedWelcome"); // No need to wait for 'setItem'
        this.welcomeDialog.openDialog();
      } else if (value === 'showedWelcome' && !this.props.is_logged_in) {
        AsyncStorage.setItem("alreadyLaunched", "showedConfirm");
        this.codeConfirmDialog.openDialog();
      }
    }).done();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isComplete) {
      this.closeIntro();
    }
    if (this.props.connectionState !== nextProps.connectionState) {
      if (['wifi', 'unknown', 'mobile'].indexOf(nextProps.connectionState.type.toString().toLowerCase()) >= 0) {
        this.props.packsAttempt();
        this.checkoutDownloadedPack();
      }
    }
    if (this.props.language !== nextProps.language || this.props.lastSync !== nextProps.lastSync) {
      this.props.packsAttempt();
      this.checkoutDownloadedPack();
      this.readingLocalData(nextProps.language);
    }
    if (nextProps.packs.length > 0) {
      this.onlineData(nextProps.packs);
    }
  }
  componentWillUnmount() {
    NetInfo.removeEventListener(
      'change',
      this.handleConnectionInfoChange,
    );
  }
  showVideo = () => {
    // AsyncStorage.getItem("loadedCounter").then(value => {
    //     if (value === null || parseInt(value) < 2) {
    //         this.props.setWatchVideoEnabled(true);
    //     } else {
    //         this.props.setWatchVideoEnabled(false);
    //     }
    //     let newVal = parseInt(value) + 1;
    //     AsyncStorage.setItem("loadedCounter", (value === null) ? "1"  : newVal.toString()); // No need to wait for 'setItem'
    // }).done();
    this.videoDialog.show();
  };
  onSetting() {
    this.navigateTo('setting');
  }
  onTermsOfService() {
    this.welcomeDialog.closeDialog();
    this.navigateTo('terms');
  }
  closeWelcomeDialog() {
    this.welcomeDialog.closeDialog();
    if (!this.props.is_logged_in)
      setTimeout(() => { this.codeConfirmDialog.openDialog(); AsyncStorage.setItem("alreadyLaunched", "showedConfirm"); }, 2000);
  }
  onRegister() {
    this.replaceRoute('register');
    this.props.setFirstTime(true);
  }
  closeConfirmDialog() {
    this.codeConfirmDialog.closeDialog();
    this.props.setFirstTime(true);
    let _this = this;
    setTimeout(() => _this.syncDialog.show(), 2000);
    this.setState({ syncOpened: true });
  }
  onBook(book, pack, story) {
    const bookSize = book.story_pages.length;
    Analytics.logEvent('category_screen', { bookSize });
    this.navigateTo('showPage', { pack, story });
  }
  onDeleteDialog(data) {
    DatabaseService.delete(data, this.props.email);
    setTimeout(() => {
      this.readingLocalData();
      this.props.packsAttempt();
      this.setState({ clickFlag: false, downloadPercent: 0 });
    }, 100);
    this.delDialog.dismiss();
  }
  onOpenDialog(data) {
    this.popupDialog.show();
    packData = data;
  }
  onCloseDialog() {
    this.popupDialog.dismiss();
  }
  onOpenDialog1(data) {
    this.props.setDefaultPrice();
    // this.unlockDialog && this.unlockDialog.openDialog();
    this.popupDialog1.show();
    packData = data;
  }
  onCloseDialog1() {
    this.popupDialog1.dismiss();
  }
  deleteDialog(data) {
    this.delDialog.show();
    deleteData = data;
  }
  closeIntro() {
    this.syncDialog.dismiss();
    this.props.setFirstTime(false);
    this.setState({ syncOpened: false });
  }
  onSubmitIntro() {
    this.props.setFirstTime(false);
    this.props.syncAll();
  }
  loginOther() {
    Alert.alert('Are you sure you want to logout?', 'Logging out will remove all downloaded packs from this device. (You will be able to reload them.)', [
      { text: 'Cancel', onPress: () => { } },
      { text: 'Logout', onPress: () => this.props.loginOther() },
    ]);
  }
  onlineData(data) {
    let mainData = [].concat(data);
    const { localData } = this.state;
    mainData = mainData.map((pack) => {
      const localPack = localData.filter(dataPack => dataPack.pack_id === pack.pack_id);
      return localPack[0] || pack;
    });
    // mainData.sort(a => (a.pack_status === 'download' ? -1 : 0));
    this.setState({ mainData });
  }
  readingLocalData(language = null) {
    console.log(this.props);
    const savedPacks = DatabaseService.findAll(this.props.email);
    console.log(savedPacks);
    const localPacks = [];
    const localData = [];
    for (let i = 0; i < savedPacks.length; i += 1) {
      console.log(savedPacks[i]);
      const hasEmail = savedPacks[i].availableFor.map(email => email.email === this.props.email).indexOf(true) >= 0;
      if (hasEmail) {
        localPacks.push({
          ...savedPacks[i],
        });
      }
    }
    for (let j = 0; j < localPacks.length; j += 1) {
      localPacks[j].title = localPacks[j].title.replace('&#39;', "'");
      const item = JSON.parse(localPacks[j].title);
      item.click = false;
      item.id = localPacks[j].id;
      item.pack_id = parseInt(localPacks[j].pack_id, 0);
      localData.push(item);
    }
    this.setState({ localData });
  }
  replaceRoute(route) {
    this.props.replaceAt('home', { key: route }, 'global');
  }
  navigateTo(route, params = {}) {
    this.props.navigateTo(route, 'home', params);
  }
  downloadMedia(source, type = 'image') {
    if (source === null || source === '') {
      return Promise.resolve(null);
    }
    const config = {};
    config.fileCache = true;
    config.appendExt = source.split('.').pop();
    return new Promise(resolve => RNFetchBlob.config(config).fetch('GET', source)
      .then((res) => {
        this.setState({ downloadPercent: this.state.downloadPercent + 1 });
        let resource = '';
        const prefix = Platform.OS === 'android' ? 'file://' : '';
        switch (type) {
          case 'image':
            resource = prefix + res.path();
            break;
          case 'video':
            resource = prefix + res.path();
            break;
          case 'audio':
            resource = res.path();
            break;
          default:
            resource = prefix + res.path();
        }
        return resolve(resource);
      })).catch(() => console.log('error while downloading: ', source));
  }
  async downloadVideos(data) {
    const promiseVideos = data.pack_stories.map(story =>
      Promise.all(
        story.story_pages
          .map(page => this.downloadMedia(page.page_video, 'video'))));
    return await Promise.all(promiseVideos);
  }
  async downloadAudios(data) {
    const promiseAudios = data.pack_stories.map(story =>
      Promise.all(
        story.story_pages
          .map(page => this.downloadMedia(page.page_audio, 'audio'))));
    return await Promise.all(promiseAudios);
  }
  async downloadAssets(data) {
    const newData = data;
    const thumbnails = data.story_thumbnails.map(item => this.downloadMedia(item));
    const downloadedThumbnails = await Promise.all(thumbnails);
    newData.story_thumbnails = downloadedThumbnails;
    const promiseBackgrounds = data.pack_stories.map(story =>
      Promise.all(
        story.story_pages
          .map(page => this.downloadMedia(page.page_background))));
    const backgrounds = await Promise.all(promiseBackgrounds);
    backgrounds.map((pages, i) =>
      pages.map((page, j) => {
        newData.pack_stories[i].story_pages[j].page_background = page;
        return page;
      }));
    const videos = await this.downloadVideos(newData);
    videos.map((pages, i) =>
      pages.map((video, j) => {
        newData.pack_stories[i].story_pages[j].page_video = video;
        return video;
      }));
    const audios = await this.downloadAudios(newData);
    audios.map((pages, i) =>
      pages.map((audio, j) => {
        newData.pack_stories[i].story_pages[j].page_audio = audio;
        return audio;
      }));
    return newData;
  }
  downloadingData(data) {
    const startTime = new Date();
    this.onCloseDialog();
    let totalLength = 0;
    totalLength += data.story_thumbnails.length;
    for (const j in data.pack_stories) {
      totalLength += data.pack_stories[j].story_pages.length;
    }
    data.click = true;
    data.pack_status = 'download';
    data.pageSize = totalLength;
    this.setState({ clickFlag: true });
    this.downloadAssets(data).then(pack => this.savePackData(pack, startTime));
  }
  reportDownloadedPack(packId, userEmailAddress, timeDownload) {
    Analytics.logEvent('download_pack', {
      packId,
      userEmailAddress,
      timeDownload,
    });
  }
  savePackData(data, startTime) {
    const duration = new Date() - startTime;
    this.reportDownloadedPack(data.pack_id, this.props.email, duration);
    const mIndex = 0;

    DatabaseService.save(new PackModel(data.pack_id, JSON.stringify(data), true, [this.props.email]));
    data.click = false;

    setTimeout(() => {
      this.readingLocalData();
      this.props.packsAttempt();
      this.setState({ clickFlag: false, downloadPercent: 0 });
    }, 100);
  }
  checkoutDownloadedPack() {
    const pendingData = DatabaseService.findAllPending();
    for (let i = 0; i < pendingData.length; i++) {
      if (pendingData[i].pendingState === false) {
        // TODO: fix me when pack have been purchased but currently not downloaded
      }
    }
  }
  BuyPack(pack) {
    this.onCloseDialog1();
    DatabaseService.savePending(new PendingModel(pack.pack_id, Global.userEmail, false));

    this.downloadingData(pack);

    DatabaseService.updatePending(pack.pack_id);
  }
  setFavouriteStory(pack, storyid) {
    if (pack.pack_stories[storyid].favoriteState) {
      pack.pack_stories[storyid].favoriteState = false;
    } else {
      pack.pack_stories[storyid].favoriteState = true;
    }
    DatabaseService.updatePack(pack.pack_id, JSON.stringify(pack));
    this.setState({ clickFlag: false, downloadPercent: 0 });
  }
  _renderGridDownloaded = (data, pack_index) => (
    <View style={styles.rowDownloadView}>
      <View style={styles.rowTitleView}>
        <View style={styles.rowTitleArea}>
          <Text style={styles.rowTitleText}>{data.pack_name}</Text>
        </View>
        <View style={styles.rowInfoArea}>
          {data.pack_status === 'locked' ? (<TouchableOpacity onPress={() => this.onOpenDialog1(data)}>
            <Icon style={styles.rowTitleIcon} name="md-lock" />
          </TouchableOpacity>) : null}
          {data.pack_status === 'download' ? (this.state.clickFlag ? null :
            <TouchableOpacity onPress={() => this.deleteDialog(data)}>
              <Icon style={styles.rowTitleIcon} name="md-trash" />
            </TouchableOpacity>) : null}
          {data.pack_status === 'free' || data.pack_status === 'available' ? (this.state.clickFlag ? null :
            <TouchableOpacity onPress={() => this.onOpenDialog(data)}>
              <Icon style={styles.rowTitleIcon} name="md-cloud-download" />
            </TouchableOpacity>) : null}
        </View>
      </View>
      <View style={styles.rowBody}>
        {data.pack_stories.map((story, index) => (
          <View style={{ flex: 1 }} key={index}>
            <TouchableOpacity
              disabled={data.pack_status !== 'download'}
              onPress={() => (data.pack_status === 'download' ?
                this.onBook(story, data.pack_id, index) : alert('You have to download this pack!'))}
            >
              <ImageBackground
                source={{ uri: data.story_thumbnails[index] }}
                style={styles.itemImage}
              >
                <View style={[styles.bottomTransView]} >
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text numberOfLines={1} style={[styles.bottomNameText]}>
                        {story.story_name}
                      </Text>
                    </View>
                    <View style={{ width: Metrics.screenWidth * 0.05, alignItems: 'center', justifyContent: 'center' }}>
                      {data.pack_status !== 'download' ? null :
                        (<TouchableOpacity
                          onPress={() => this.setFavouriteStory(data, index)}
                          style={{ alignItems: 'center', justifyContent: 'center', height: Metrics.screenWidth / 24, paddingHorizontal: 7 }}
                        >
                          <Icon style={[styles.bottomHeart, { color: story.favoriteState === true ? 'red' : 'white' }]} name={'md-heart'} />
                        </TouchableOpacity>)}
                    </View>
                  </View>
                </View>
                {data.pack_status === 'download' ? null :
                  <View style={styles.shadowStyle} />
                }
              </ImageBackground>
            </TouchableOpacity>
          </View>))}
      </View>
      {data.click ?
        <View style={styles.shadowStyle}>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent' }}>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: Metrics.screenWidth / 30, fontStyle: 'italic', color: 'white', alignSelf: 'center' }}>
                Downloading...
                </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Progress.Bar
                progress={data.pageSize ? this.state.downloadPercent / data.pageSize : 0}
                width={Metrics.cellWidth + 5}
                height={Metrics.baseMargin}
                borderRadius={0}
                style={{ marginTop: Metrics.doubleBaseMargin / 1.5, marginLeft: -5, alignSelf: 'center' }}
              />
            </View>
          </View>
        </View> :
        null
      }
    </View>
  )
  triggerPack(data) {
    switch (data.pack_status) {
      case 'free':
        return this.onOpenDialog(data);
      case 'download':
        return this.onOpenDialog(data);
      case 'locked':
        return this.onOpenDialog1(data);
      default:
        return this.onOpenDialog(data);
    }
  }
  _renderGridPack = (data, pack_index) => (
    <View style={styles.rowView}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => this.triggerPack(data)}>
        <View style={styles.rowTitleView}>
          <View style={styles.rowTitleArea}>
            <Text style={styles.rowTitleText}>{data.pack_name}</Text>
          </View>
          <View style={styles.rowInfoArea}>
            {data.pack_status === 'locked' && (<TouchableOpacity onPress={() => this.onOpenDialog1(data)}>
              <Icon style={styles.rowTitleIcon} name="md-lock" />
            </TouchableOpacity>)}
            {data.pack_status === 'download' && (this.state.clickFlag ? null :
              <TouchableOpacity onPress={() => this.onDeleteDialog(data)}>
                <Icon style={styles.rowTitleIcon} name="md-trash" />
              </TouchableOpacity>)}
            {(data.pack_status === 'free' || data.pack_status === 'available') && (this.state.clickFlag ? null :
              <TouchableOpacity onPress={() => this.onOpenDialog(data)}>
                <Icon style={styles.rowTitleIcon} name="md-cloud-download" />
              </TouchableOpacity>)}
          </View>
        </View>
        <View style={styles.rowBody}>
          {data.pack_stories.map((story, index) => (
            <View style={{ flex: 1 }} key={index}>
              <TouchableOpacity
                disabled={data.pack_status !== 'download'}
                onPress={() => (data.pack_status === 'download' ?
                  this.onBook(story, data.pack_id, index) : alert('You have to download this pack!'))}
              >
                <ImageBackground
                  source={{ uri: data.story_thumbnails[index] }}
                  style={styles.itemImage}
                >
                  <View style={[styles.bottomTransView]} >
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={[styles.bottomNameText]}>
                          {story.story_name}
                        </Text>
                      </View>
                      <View style={{ width: Metrics.screenWidth * 0.05, alignItems: 'center', justifyContent: 'center' }}>
                        {data.pack_status !== 'download' ? null :
                          (<TouchableOpacity
                            onPress={() => this.setFavouriteStory(data, index)}
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Icon style={[styles.bottomHeart, { color: story.favoriteState === true ? 'red' : 'white' }]} name={'md-heart'} />
                          </TouchableOpacity>)}
                      </View>
                    </View>
                  </View>
                  {data.pack_status === 'download' ? null :
                    <View style={styles.shadowStyle} />
                  }
                </ImageBackground>
              </TouchableOpacity>
            </View>))}
        </View>
        {data.click ?
          <View style={styles.shadowStyle}>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent' }}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: Metrics.screenWidth / 30, fontStyle: 'italic', color: 'white', alignSelf: 'center' }}>
                  Downloading...
                  </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Progress.Bar
                  progress={data.pageSize ? this.state.downloadPercent / data.pageSize : 0}
                  width={Metrics.cellWidth + 5}
                  height={Metrics.baseMargin}
                  borderRadius={0}
                  style={{ marginTop: Metrics.doubleBaseMargin, marginLeft: -5, alignSelf: 'center' }}
                />
              </View>
            </View>
          </View> :
          null
        }
      </TouchableOpacity>
    </View>
  )
  _renderGridCell = (data, pack_index) => data.pack_status === 'download' ? this._renderGridDownloaded(data, pack_index) : this._renderGridPack(data, pack_index)
  handleConnectionInfoChange = (connectionInfo) => {
    this.setState({ connectionInfo });
    this.props.changeConnection(connectionInfo);
  };

  unlockPurchase = () => {
    if (this.unlockCallback) {
      this.unlockCallback();
    }
  };

  openUnlockDialog = (callback) => {
    this.unlockCallback = callback;
    this.unlockDialog.show();
  };

  successPurchase = () => {
    this.onCloseDialog1();
    setTimeout(() => this.syncDialog.show(), 2000);
  };

  render() {
    const { mainData, localData } = this.state;
    const connectView = this.props.connectionState && ['mobile', 'wifi', 'unknown'].indexOf(this.props.connectionState.type.toString().toLowerCase()) >= 0 ? null :
      (<View style={{ width: Metrics.screenWidth, height: Metrics.screenHeight / 7, flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={Images.offline}
          resizeMode={'stretch'}
          style={styles.offlineImage}
        />
        <Text style={{ color: 'grey', fontSize: Metrics.screenWidth / 40 }}>
          Connect to the Internet to browse for more ReadAskChat story packs.
      </Text>
      </View>);
    return (
      <View style={[Styles.fullScreen, { flexDirection: 'column', backgroundColor: Colors.brandPrimary }]}>
        <View style={styles.headerView}>
          <ImageBackground source={Images.logo} resizeMode={'contain'} style={styles.headerViewLogo} />
          <View style={styles.headerButtonView}>
            <TouchableOpacity onPress={() => this.onSetting()}>
              <View style={styles.headerButtonInner}>
                <Image
                  source={Images.setting}
                  resizeMode={'stretch'}
                  style={styles.headerSettingButtonImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.showVideo()}>
          <View style={{ flexDirection: 'row',alignItems:'center' }}>
            <Text style={styles.watchVideoTitle}>WATCH THE HOW-TO VIDEO</Text>
            <Image
              source={Images.video}
              style={styles.watchVideoButtonImage} />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <SudokuGrid
              columnCount={1}
              dataSource={['mobile', 'wifi', 'unknown'].indexOf(this.props.connectionState && this.props.connectionState.type.toString().toLowerCase()) >= 0 ? mainData : localData}
              renderCell={this._renderGridCell}
            />
            {connectView}
          </ScrollView>
        </View>
        <PopupDialog
          ref={(popupDialog1) => { this.popupDialog1 = popupDialog1; }}
          width={Metrics.screenWidth}
          // height={Metrics.screenHeight / 1.2}
          height={Metrics.realScreenHeight}
        >
          <Purchase
            successPurchase={() => this.successPurchase()}
            dismissPurchase={() => this.onCloseDialog1()}
          />
        </PopupDialog>
        <PopupDialog
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          width={Metrics.screenWidth / 2.3}
          height={Metrics.screenHeight / 2.3}
        >
          <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin, marginTop: Metrics.baseMargin, marginBottom: Metrics.baseMargin }}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: Metrics.screenWidth / 30, color: 'rgba(0,0,0,0.7)' }}>Download Pack</Text>
              <Text style={{ fontSize: Metrics.screenWidth / 40, color: 'rgba(0,0,0,0.7)', marginTop: Metrics.smallMargin }}>Download this story pack to this device?</Text>
            </View>
            <View style={{ height: Metrics.screenHeight * 0.1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 }}>
              <Button
                style={[Styles.buttonRadius, styles.cancelButton]}
                onPress={() => this.onCloseDialog()}
                textStyle={styles.cancelButtonText}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                style={[Styles.buttonRadius, styles.downloadButton]}
                onPress={() => this.downloadingData(packData)}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </Button>
            </View>
          </View>
        </PopupDialog>

        <PopupDialog
          ref={(ref) => { this.delDialog = ref; }}
          width={Metrics.screenWidth / 2.3}
          height={Metrics.screenHeight / 2.3}
        >
          <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin, marginTop: Metrics.baseMargin, marginBottom: Metrics.baseMargin }}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: Metrics.screenWidth / 30, color: 'rgba(0,0,0,0.7)' }}>Delete Story Pack</Text>
              <Text style={{ fontSize: Metrics.screenWidth / 40, color: 'rgba(0,0,0,0.7)', marginTop: Metrics.smallMargin }}>Are you sure you want to delete this story pack from this device?</Text>
            </View>
            <View style={{ height: Metrics.screenHeight * 0.1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 }}>
              <Button
                style={[Styles.buttonRadius, styles.cancelButton]}
                onPress={() => this.delDialog.dismiss()}
                textStyle={styles.cancelButtonText}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                style={[styles.downloadButton, Styles.buttonRadius, { backgroundColor: 'red' }]}
                onPress={() => this.onDeleteDialog(deleteData)}
                textStyle={styles.downloadButtonText}
              >
                <Text>Ok</Text>
              </Button>
            </View>
          </View>
        </PopupDialog>

        <PopupDialog
          ref={(introDialog) => { this.introDialog = introDialog; }}
          dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
          width={Metrics.screenWidth / 2}
          height={280}
        >
          <Intro
            onCloseDialog={() => this.closeIntro()}
            connection={this.props.connectionState}
          />
        </PopupDialog>
        <PopupDialog
          ref={(syncDialog) => { this.syncDialog = syncDialog; }}
          width={scale(318)}
          height={scaleByVertical(188)}
        >
          <SyncDialog
            onSubmit={() => this.onSubmitIntro()}
            onDismiss={() => this.closeIntro()}
            progress={this.props.progress}
            isDownloading={this.props.isDownloading}
          />
        </PopupDialog>
        <ActivityIndicator
          animating={this.props.attempting && !this.state.syncOpened}
          size="large"
          style={{ position: 'absolute', top: Metrics.screenHeight / 2, left: Metrics.screenWidth / 2 }}
        />
        <WelcomeDialog
          width={Metrics.screenWidth / 2.2}
          height={Metrics.screenWidth / 2.6}
          onReference={(id) => { this.welcomeDialog = id; }}
          closeWelcome={() => this.closeWelcomeDialog()}
          gotoTermsOfService={() => this.onTermsOfService()}
        />
        <CodeConfirmDialog
          width={Metrics.screenWidth / 2.2}
          height={Metrics.screenWidth / 2.6}
          onReference={(id) => { this.codeConfirmDialog = id; }}
          closeConfirm={() => this.closeConfirmDialog()}
          gotoRegister={() => this.onRegister()}
        />
        <VideoDialog
          width={Metrics.screenWidth / 2.2}
          height={Metrics.screenWidth / 2.6}
          onReference={(id) => { this.videoDialog = id; }}
        />
      </View>
    );
  }
}

function bindAction(dispatch) {
  return {
    logout: () => {
      dispatch(setCredentialLoggedIn(false));
      dispatch(replaceAt('home', { key: 'login' }, 'global'));
    },
    loginOther: () => {
      dispatch(setCredentialLoggedIn(false));
      dispatch(setCredentialToken(''));
      dispatch(setCredentialEmail(''));
      dispatch(packsReset());
      dispatch(logout());
      dispatch(replaceAtIndex(0, { key: 'login' }, 'global'));
    },
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    navigateTo: (route, homeRoute, params) => dispatch(navigateTo(route, homeRoute, params)),
    packsAttempt: () => dispatch(packsAttempt()),
    setDevelopmentLevel: key => dispatch(setPreference('developmentLevel', key)),
    attemptCredentialUser: key => dispatch(attemptCredentialUser(key)),
    changeConnection: connectionState => dispatch(changeConnection(connectionState)),
    checkLockedPacks: packs => dispatch(checkLockedPacks(packs)),
    setFirstTime: first_time => dispatch(setFirstTime(first_time)),
    syncAll: () => dispatch(syncAll()),
    setDefaultPrice: () => dispatch(setDefaultPrice()),
  };
}

function mapStateToProps(state) {
  const { email, first_time, is_logged_in } = state.credential;
  const { packs, attempting } = state.packsReducer;
  const { connectionState } = state.connectionReducer;
  const { language, lastSync, developmentLevel } = state.preference;
  const { isDownloading, progress, isComplete } = state.sync;
  return { attempting, packs, connectionState, email, language, lastSync, developmentLevel, first_time, isDownloading, progress, isComplete };
}

export default connect(mapStateToProps, bindAction)(Home);
