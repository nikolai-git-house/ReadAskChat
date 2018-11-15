import { take, call, put, select } from 'redux-saga/effects';
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Types from '../actions/ActionTypes';
import { packsAttempt } from '../actions/packsActions';
import { packDownloadsDone, syncProgress } from '../actions/Creators';

export default (api) => {
  const dataPacks = state => state.packsReducer.downloadPacks;
  let total = 0;
  let currentProgress = 0;
  function setTotal(totalAssets) {
    total = totalAssets;
  }
  function* updateProgress(source) {
    currentProgress += 1;
    yield put(syncProgress(currentProgress / total));
  }
  async function downloadSource(source, type = 'image') {
    if (source === null || source === '') {
      return Promise.resolve(null);
    }
    const config = {};
    config.fileCache = true;
    config.appendExt = source.split('.').pop();
    const response = new Promise(resolve => RNFetchBlob.config(config).fetch('GET', source)
    .then((res) => {
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
    return response;
  }
  function* downloadMedia(source, type) {
    const response = yield call(downloadSource, source, type);
    if (!!source) {
      yield call(updateProgress, source);
    }
    return response;
  }
  function* downloadVideos(data) {
    return yield data.pack_stories.map(story =>
        story.story_pages
        .map(page => call(downloadMedia, page.page_video, 'video')));
  }
  function* downloadAudios(data) {
    return yield data.pack_stories.map(story =>
        story.story_pages
        .map(page => call(downloadMedia, page.page_audio, 'audio')));
  }
  function* downloadAssets(data) {
    const newData = data;
    const downloadedThumbnails = yield data.story_thumbnails.map(item => call(downloadMedia, item));
    newData.story_thumbnails = downloadedThumbnails;
    const backgrounds = yield data.pack_stories.map(story =>
        story.story_pages
        .map(page => call(downloadMedia, page.page_background)));
    backgrounds.map((pages, i) =>
      pages.map((page, j) => {
        newData.pack_stories[i].story_pages[j].page_background = page;
        return page;
      }));
    const videos = yield call(downloadVideos, newData);
    videos.map((pages, i) =>
      pages.map((video, j) => {
        newData.pack_stories[i].story_pages[j].page_video = video;
        return video;
      }));
    const audios = yield call(downloadAudios, newData);
    audios.map((pages, i) =>
      pages.map((audio, j) => {
        newData.pack_stories[i].story_pages[j].page_audio = audio;
        return audio;
      }));
    return newData;
  }
  function* downloadAllAssets(packs) {
    return yield packs.map(pack => call(downloadAssets, pack));
  }
  function* worker() {
    const packs = yield select(dataPacks);

    setTotal(packs.map(pack => {
      return pack.story_thumbnails.length + pack.pack_stories.map(story => {
        return story.story_pages.map(story => {
          return 1 + !!story.page_audio + !!story.page_video;
        }).reduce((totalStoryAsset, storyAsset) => totalStoryAsset + storyAsset, 0);
      }).reduce((totalPack, packAsset) => packAsset + totalPack, 0);
    }).reduce((totalAssets, packLength) => packLength + totalAssets, 0));
    const results = yield call(downloadAllAssets, packs);
    yield put(packDownloadsDone(results));
    currentProgress = 0;
  }

  function* watcher() {
    while (true) {
      yield take(Types.PACKS_DOWNLOAD);
      yield call(worker);
    }
  }

  return {
    watcher,
    worker,
  };
};
