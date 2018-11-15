import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, Text, PanResponder, Dimensions, Platform } from 'react-native';
import { Icon, Radio, Button } from 'native-base';
import Sound from 'react-native-sound';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import Swiper from 'react-native-swiper';
import { View } from 'react-native-animatable';
import DatabaseService from '@database/DatabaseService';
import CustomSwiper from '@controls/swiper';
import navigateTo from '@actions/sideBarNav';
import { BOLD_WORDS } from '@src/Constants';
import RadioButton from 'react-native-radio-button';

import Global from '@src/Global';
import { Images, Colors, Metrics, Styles } from '@theme/';
import styles from './styles';
import InfoDialog from './info-dialog';
import { setPreference, swipePage, viewPack, closePack, conversationClose, conversationOpen } from '../../actions/Creators';
import { scaleByVertical, scale } from '../../scaling/utils';
import theme from '../../themes/base-theme';

const Analytics = require('react-native-firebase-analytics');

const {
  replaceAt,
  popRoute,
} = actions;
const { height, width } = Dimensions.get('window');

class ShowPage extends Component {

  static propTypes = {
    popRoute: PropTypes.func,
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
    navigateTo: PropTypes.func,
    replaceAt: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const colors = {
      baby: Colors.babyColor,
      toddler: Colors.toddlerColor,
      preschooler: Colors.preschoolerColor,
    };
    const images = {
      baby: Images.messageBaby,
      toddler: Images.messageToddler,
      preschooler: Images.messagePreschooler,
    };
    const icons = {
      baby: Images.babyIcon,
      toddler: Images.toddlerIcon,
      preschooler: Images.preschoolerIcon,
    };
    this.state = {
      position: 0,
      isMediaPlaying: false,
      localPack: {},
      book: {},
      books: [],
      isBaby: false,
      selectedBaby: this.props.developmentalLevel === 'baby',
      selectedToddler: this.props.developmentalLevel === 'toddler',
      selectedPreschooler: this.props.developmentalLevel === 'preschooler',
      messageBgColor: colors[this.props.developmentalLevel],
      messageImage: images[this.props.developmentalLevel],
      personIcon: icons[this.props.developmentalLevel],
      reverse: false,
      promtIndex: 0,
      initialPosition: 0,
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // check if x gesture state is more than tolerated x
        if (Math.abs(gestureState.dx) <= 30) {
          this.onBabyDisable();
        } else {
          const forward = () => this.customSwiper.currentIndex() < this.customSwiper.total() - 1 ? this.customSwiper.scrollBy(1) : null;
          const backward = () => this.customSwiper.currentIndex() > 0 ? this.customSwiper.scrollBy(-1) : null;
          gestureState.dx >= 0 ? backward() : forward();
        }
      },
    });
    this.currentSound = null;
    this.swiper = null;
    this.videoWrapper = null;
  }
  componentWillMount() {
    if (typeof this.props.pack === 'undefined' || this.props.pack === null) {
      this.props.popRoute();
      return;
    }
    if (typeof this.props.story === 'undefined' || this.props.story === null) {
      this.props.popRoute();
      return;
    }
    const localPack = DatabaseService.findPackById(this.props.pack)[0];
    const pack = JSON.parse(localPack.title);
    const startingIndexes = pack.pack_stories
    .map(story => story.story_pages.length)
    .reduce((start, value, index, whole) =>
      start.concat(whole[index - 1] ? whole[index - 1] + start[index - 1] : 0),
    []);
    const position = startingIndexes[this.props.story];
    const books = pack.pack_stories
      .map(story => story.story_pages
        .map((page, actual_index) =>
          Object.assign(page, { story, actual_index, page_length: story.story_pages.length })))
      .reduce((all, stories) => all.concat(...stories), []);
    this.setState({
      localPack,
      startingIndexes,
      books,
      position,
      initialPosition: position,
    });
    this.props.viewPack(localPack.pack_id);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timerPage);
    this.props.closePack(this.state.localPack.pack_id);
  }
  onOpenBaby() {
    const page = this.state.books[this.state.position];
    this.timer = setTimeout(() => this.props.conversationClose(this.state.localPack.pack_id, page.story.story_id, page.page_id), 5 * 60 * 1000);
    this.props.conversationOpen(this.state.localPack.pack_id, page.story.story_id, page.page_id);
    this.setState({ isBaby: true, isTudle: false, isPreschooler: false, isMore: false });
  }
  onBabyDisable() {
    clearTimeout(this.timer);
    this.viewBaby.animate('fadeOutDown', 500).then(() => {
      const page = this.state.books[this.state.position];
      this.props.conversationClose(this.state.localPack.pack_id, page.story.story_id, page.page_id);
      this.setState({ isBaby: false });
    });
  }
  onBack() {
    this.popRoute();
  }
  onScrollBegin() {
    if (this.state.isBaby) {
      const page = this.state.books[this.state.position];
      this.props.conversationClose(this.state.localPack.pack_id, page.story.story_id, page.page_id);
    }
  }
  onOpenDialog() {
    this.popupDialog.show();
  }
  onCloseDialog() {
    this.popupDialog.dismiss();
  }
  onOpenDialog1() {
    this.popupDialog1.show();
  }
  onCloseDialog1() {
    this.popupDialog1.dismiss();
  }
  onOptioned(option) {
    console.log('ONOPTIONED ------- -------', option);
    this.setState({ promtIndex: 0 });
    this.props.setDevelopmentalLevel(option);
    switch (option) {
      case 'baby':
        this.setState({
          selectedBaby: true,
          selectedToddler: false,
          selectedPreschooler: false,
          messageImage: Images.messageBaby,
          personIcon: Images.babyIcon,
          messageBgColor: Colors.babyColor,
          reverse: false,
        });
        break;
      case 'toddler':
        this.setState({
          selectedBaby: false,
          selectedToddler: true,
          selectedPreschooler: false,
          messageImage: Images.messageToddler,
          personIcon: Images.toddlerIcon,
          messageBgColor: Colors.toddlerColor,
          reverse: false,
        });
        break;
      case 'preschooler':
        this.setState({
          selectedBaby: false,
          selectedToddler: false,
          selectedPreschooler: true,
          messageImage: Images.messagePreschooler,
          personIcon: Images.preschoolerIcon,
          messageBgColor: Colors.preschoolerColor,
          reverse: false,
        });
        break;
      default:
        this.onCloseDialog();
    }
    this.onCloseDialog();
  }
  onMomentumScrollEnd(e, state, context) {
    this.onMediaStop();
    clearTimeout(this.timerPage);
    this.timerPage = setTimeout(
      () => this.props.swipePage(this.state.localPack.pack_id, this.state.books[context.state.index].story.story_id, this.state.books[context.state.index].page_id),
      5 * 60 * 1000,
    );
    this.setState({ isBaby: false, promtIndex: 0, reverse: false });
    this.props.swipePage(this.state.localPack.pack_id, this.state.books[context.state.index].story.story_id, this.state.books[context.state.index].page_id);
    this.setState({
      position: context.state.index,
      isMediaPlaying: false,
    }, () => {
      if (this.currentSound !== null) {
        this.currentSound.stop();
        this.currentSound.release();
        this.currentSound = null;
      }
    });
  }
  onButtonDialogMomentumScrollEnd(e, state, context) {
    this.setState({ promtIndex: state.index });
    if (this.state.selectedBaby) {
      this.reportButtonDialog(this.state.books[this.state.position].page_id, 'BABY', context.state.index, Global.userEmail, Global.pageTime);
      const messages = this.state.books[this.state.position].page_prompts
      .filter(prompt => prompt.prompt_level === 'baby')
      .filter(prompt => (prompt.prompt_language.toLowerCase() === this.props.language.toLowerCase()));
      if (!messages[context.state.index].prompt_content.indexOf('MORE') || !messages[context.state.index].prompt_content.indexOf('¡MÁS!')) {
        this.setState({ reverse: true });
      } else if (this.state.reverse) {
        this.setState({ reverse: false });
      }
    } else if (this.state.selectedPreschooler) {
      this.reportButtonDialog(this.state.books[this.state.position].page_id, 'PRESCHOOLER', context.state.index, Global.userEmail, Global.pageTime);
      const messages = this.state.books[this.state.position].page_prompts
      .filter(prompt => ['preschooler'].indexOf(prompt.prompt_level) >= 0)
      .filter(prompt => (prompt.prompt_language.toLowerCase() === this.props.language.toLowerCase()));
      if (!messages[context.state.index].prompt_content.indexOf('MORE') || !messages[context.state.index].prompt_content.indexOf('¡MÁS!')) {
        this.setState({ reverse: true });
      } else if (this.state.reverse) {
        this.setState({ reverse: false });
      }
    } else if (this.state.selectedToddler) {
      this.reportButtonDialog(this.state.books[this.state.position].page_id, 'TODDLER', context.state.index, Global.userEmail, Global.pageTime);
      const messages = this.state.books[this.state.position].page_prompts
      .filter(prompt => prompt.prompt_level === 'toddler')
      .filter(prompt => (prompt.prompt_language.toLowerCase() === this.props.language.toLowerCase()));
      if (!messages[context.state.index].prompt_content.indexOf('MORE') || !messages[context.state.index].prompt_content.indexOf('¡MÁS!')) {
        this.setState({ reverse: true });
      } else if (this.state.reverse) {
        this.setState({ reverse: false });
      }
    }
  }

  reportStoryPage(pageId, developmentalLevel, userEmailAddress, timeSpend) {
    Analytics.logEvent('story_page', {
      pageId,
      developmentalLevel,
      userEmailAddress,
      timeSpend,
    });
  }
  reportButtonDialog(pageId, developmentalLevel, dialogIndexNumber, userEmailAddress) {
    Analytics.logEvent('prompt_dialogs', {
      pageId,
      developmentalLevel,
      dialogIndexNumber,
      userEmailAddress,
    });
  }
  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }
  ref = null;
  handleRef = (ref) => {
    this.ref = ref;
  }
  replaceRoute(route) {
    this.props.replaceAt('showPage', { key: route }, 'global');
  }
  navigateTo(route) {
    this.props.navigateTo(route, 'showPage');
  }
  forwardPage() {
    this.setState({
      isBaby: false,
    }, () => this.swiper.scrollBy(1, true));
  }
  backwardPage() {
    this.setState({
      isBaby: false,
    }, () => this.swiper.scrollBy(-1, true));
  }
  showInfoDialog() {
    this.infoDialog.show();
  }
  currentPage() {
    return this.state.books[this.state.position];
  }
  hasVideo() {
    return !!this.state.books[this.state.position].page_video;
  }
  hasAudio() {
    return !!this.state.books[this.state.position].page_audio;
  }
  isMediaPlaying() {
    return this.state.isMediaPlaying;
  }
  showPlayer() {
    // both media are set or not at all
    if ((this.hasVideo() && this.hasAudio()) || (!this.hasAudio() && !this.hasVideo())) {
      return (<View style={[styles.bottomBackgroundContainer, { marginLeft: 10, padding: 0, backgroundColor: 'transparent' }]}>
        <TouchableOpacity onPress={() => this.toggleMedia()} style={[styles.playerIcon, { justifyContent: 'center' }]}>
          <Image
            resizeMode="contain"
            style={[styles.mediaIcon, { alignSelf: 'center', tintColor: this.isMediaPlaying() ? '#D32F2F' : '#fff' }]}
          />
        </TouchableOpacity>
      </View>);
    }
    return (<View style={[styles.bottomBackgroundContainer, { marginLeft: 10, padding: 0 }]}>
      <TouchableOpacity onPress={() => this.toggleMedia()} style={[styles.playerIcon, { justifyContent: 'center' }]}>
        <Image
          resizeMode="contain"
          style={[styles.mediaIcon, { alignSelf: 'center', tintColor: this.isMediaPlaying() ? '#D32F2F' : '#fff' }]}
          source={this.hasVideo() ? Images.video : Images.audio}
        />
      </TouchableOpacity>
    </View>);
  }
  toggleMedia() {
    this.setState({ isMediaPlaying: !this.isMediaPlaying() }, () => {
      if (this.hasVideo()) {
        this.videoWrapper.transitionTo({ opacity: 1 });
      }
      if (this.hasAudio()) {
        // means that the sound should play
        if (this.isMediaPlaying()) {
          if (this.currentSound === null) {
            this.currentSound = new Sound(this.currentPage().page_audio, null, (error) => {
              if (error) {
                return null;
              }
              this.currentSound.play(() => {
                this.onMediaStop();
              });
            });
          } else {
            this.currentSound.play(() => {
              this.onMediaStop();
            });
          }
        } else {
          this.currentSound.pause();
        }
      }
    });
  }
  onMediaStop() {
    if (this.hasVideo()) {
      this.videoWrapper.transitionTo({ opacity: 0 });
    }
    this.setState({
      isMediaPlaying: false,
    }, () => {
      if (this.currentSound !== null) {
        this.currentSound.stop();
      }
    });
  }
  renderAudioPlayer() {
    return (<View />);
  }
  renderVideoPlayer() {
    return (
      <View
        style={styles.video}
        ref={(videoWrapper) => { this.videoWrapper = videoWrapper; }}
      >
        <Video
          style={{ flex: 1 }}
          rate={1}
          paused={!this.state.isMediaPlaying}
          source={{ uri: this.currentPage().page_video }}
          volume={1}
          resizeMode={'contain'}
          onEnd={() => this.onMediaStop()}
          repeat={false}
        />
      </View>);
  }
  renderPlayer() {
    return this.hasVideo() ? this.renderVideoPlayer() : this.renderAudioPlayer();
  }
  replaceBold(text, lang) {
    const string = ` ${text}`;
    const lines = [];
    let last = 0;
    const reg = new RegExp(BOLD_WORDS[lang].reduce((reg, word, i) => {
      reg += `\\W(${word})\\W${i + 1 < BOLD_WORDS[lang].length ? '|' : ''}`;
      return reg;
    }, ''), 'g');
    let result;
    while (result = reg.exec(string)) {
      lines.push(text.substring(last - 1, result.index));
      lines.push(<Text style={{ fontWeight: '900' }} key={result.index}>{result.splice(1, BOLD_WORDS[lang].length).find(r => r)} </Text>);
      last = result.index + result[0].length;
    }
    lines.push(string.substring(last).trim());
    return lines;
  }

  lists = () => this.state.books.map(item => (
    <View style={styles.slide} key={item.page_id}>
      <Image
        resizeMode="stretch"
        style={styles.image}
        source={{ uri: item.page_background }}
      />
    </View>
  ));

  render() {
    if (!this.state.books) {
      return (<View />);
    }
    
    const buttonContent = this.state.books[this.state.position].page_prompts
    .filter(prompt => (prompt.prompt_language && prompt.prompt_language.toLowerCase() === this.props.language.toLowerCase()) || !prompt.prompt_language)
    .filter(prompt => prompt.prompt_level === this.props.developmentalLevel)
    .sort((a, b) => (a.prompt_sort < b.prompt_sort ? -1 : 1));
    const messageLists = buttonContent.map((item, i) => (
      <View style={{ flex: 1, height: scaleByVertical(50), width: scale(200) }} key={i} plusDot={item.prompt_content}>
        <Text>
          <Text style={{ color: item.prompt_content.indexOf('MORE') > -1 || item.prompt_content.indexOf('¡MÁS!') > -1 ? this.state.messageBgColor : '#FFFFFF', fontWeight: 'bold', fontSize: scaleByVertical(12) }}>
            {this.replaceBold(item.prompt_content, item.prompt_language)}
          </Text>
        </Text>
      </View>
    ));
    return (
      <View style={styles.mainView}>
        <Swiper
          ref={(swiper) => { this.swiper = swiper; }}
          loop
          index={this.state.initialPosition}
          onTouchStart={() => this.onScrollBegin()}
          dotStyle={{ backgroundColor: 'transparent' }}
          paginationStyle={{ bottom: -25 }}
          activeDotStyle={{ backgroundColor: 'transparent' }}
          onMomentumScrollEnd={(e, state, context) => this.onMomentumScrollEnd(e, state, context)}
          scrollEnabled={this.props.swipeEnabled}
        >
          { this.lists() }
        </Swiper>
        <View style={styles.bottomView}>
          <View
            style={[styles.bottomViewButtonWrapper, styles.bottomBackgroundContainer, { position: 'absolute', left: 40 }]}
          >
            <TouchableOpacity
              onPress={() => this.onBack()}
              style={styles.bottompromptspacer}
            >
              <Image
                style={styles.iconBook}
                source={Images.books}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onOpenDialog()}
              style={styles.bottompromptspacer}
            >
              <Image
                source={this.state.personIcon}
                style={styles.iconChildren}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.showInfoDialog()}
              style={styles.bottompromptspacer}
            >
              <Image
                resizeMode={'contain'}
                style={styles.iconInfo}
                source={Images.infoIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.bottomViewButtonWrapper, { alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 80 }]}>
            <View style={[styles.bottomBackgroundContainer, styles.textIndicatorWrapper]}>
              <TouchableOpacity style={[styles.iconTouchable]} onPress={this.backwardPage.bind(this)}>
                <Icon style={[styles.iconStyle]} name="ios-arrow-back" />
              </TouchableOpacity>
              <View style={styles.indicatorWrapper}>
                <Text style={styles.textIndicator}>
                  {this.state.books[this.state.position].actual_index + 1} of {this.state.books[this.state.position].page_length}
                </Text>
              </View>
              <TouchableOpacity style={[styles.iconTouchable]} onPress={this.forwardPage.bind(this)}>
                <Icon style={[styles.iconStyle]} name="ios-arrow-forward" />
              </TouchableOpacity>
            </View>
            {this.showPlayer()}
          </View>
          <View style={[styles.bottomViewButtonWrapper, { opacity: this.state.isBaby ? 0 : 1, backgroundColor: 'transparent', position: 'absolute', right: 20 }]}>
            <TouchableOpacity
              style={styles.messageView}
              onPress={() => this.state.isBaby ? this.onBabyDisable() : this.onOpenBaby()}
            >
              <Image
                source={this.state.messageImage}
                style={styles.messageIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        {this.renderPlayer()}
        {
          this.state.isBaby ?
          (<View
            animation="fadeInUpBig"
            ref={(o) => { this.viewBaby = o; }}
            duration={500}
            style={[styles.popView, {
              backgroundColor: this.state.reverse ? 'white' : this.state.messageBgColor,
              borderColor: this.state.reverse ? this.state.messageBgColor : 'white',
              height: scaleByVertical(this.props.language.toLowerCase() === 'en' ? 94 : 104),
              width: scale(225),
            }]}
            {...this._panResponder.panHandlers}
          >
            <CustomSwiper
              loop={false}
              ref={(ref) => { this.customSwiper = ref; }}
              width={scale(210)}
              height={scaleByVertical(this.props.language.toLowerCase() === 'en' ? 94 : 104)}
              paginationStyle={{ bottom: scaleByVertical(13) }}
              activePlusColor = {this.state.messageBgColor}
              onMomentumScrollEnd={(e, state, context) => this.onButtonDialogMomentumScrollEnd(e, state, context)}
              index={this.state.promtIndex}
            >
              { messageLists }
            </CustomSwiper>
          </View>) : null
        }
        <ChooseDialog
          onReference={id => this.popupDialog = id}
          onOptioned={option => this.onOptioned(option)}
          developmentalLevel={this.props.developmentalLevel}
          onCloseDialog={this.onCloseDialog}
          dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        />
        <InfoDialog
          width={Metrics.screenWidth / 1.6}
          height={Metrics.screenWidth / 2.6}
          onReference={(id) => { this.infoDialog = id; }}
          pack={this.state.books[this.state.position].story}
        />
        <PopupDialog
          ref={(popupDialog1) => { this.popupDialog1 = popupDialog1; }}
          dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
          width={Metrics.screenWidth / 2.3}
          height={Metrics.screenWidth / 1.5}
        >
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: Metrics.screenWidth / 32 }}>
              What are your goals?
            </Text>
            <Text style={{ fontSize: Metrics.screenWidth / 42, marginTop: Metrics.smallMargin }}>
              Lorem ipsum dolor elysium elit dolor elit.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.baseMargin }}>
              <RadioButton
                  anmation={'bounceIn'}
                  size={13}
                  innerColor={'#D3D3D3'}
                  outerColor={'#D3D3D3'}
                  isSelected={this.state.selectedBaby}
                  onPress={() => this.onCloseDialog1()}
              />
              <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.babyColor, marginLeft: Metrics.baseMargin }}>
                Read 5 times per week
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                  anmation={'bounceIn'}
                  size={13}
                  innerColor={'#D3D3D3'}
                  outerColor={'#D3D3D3'}
                  isSelected={this.state.selectedToddler}
                  onPress={() => this.onCloseDialog1()}
              />
              <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.toddlerColor, marginLeft: Metrics.baseMargin }}>
                Read 3 times per week
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                  anmation={'bounceIn'}
                  size={13}
                  innerColor={'#D3D3D3'}
                  outerColor={'#D3D3D3'}
                  isSelected={this.state.selectedPreschooler}
                  onPress={() => this.onCloseDialog1()}
              />
              <Text style={{ fontSize: Metrics.screenWidth / 45, color: Colors.preschoolerColor, marginLeft: Metrics.baseMargin }}>
                Other
              </Text>
            </View>
          </View>
        </PopupDialog>
      </View>
    );
  }
}

class ChooseDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBaby: this.props.developmentalLevel === 'baby',
      selectedToddler: this.props.developmentalLevel === 'toddler',
      selectedPreschooler: this.props.developmentalLevel === 'preschooler',
      selectedOption: '',
      dialogAnimation: '',
    };
  }

  onSelected(option) {
    switch (option) {
      case 'baby':
        this.setState({
          selectedBaby: true,
          selectedToddler: false,
          selectedPreschooler: false,
          selectedOption: option,
          dialogAnimation: 'none',
        });
        break;
      case 'toddler':
        this.setState({
          selectedBaby: false,
          selectedToddler: true,
          selectedPreschooler: false,
          selectedOption: option,
          dialogAnimation: 'none',
        });
        break;
      case 'preschooler':
        this.setState({
          selectedBaby: false,
          selectedToddler: false,
          selectedPreschooler: true,
          selectedOption: option,
          dialogAnimation: 'none',
        });
        break;
      default:
        this.props.onCloseDialog();
    }
  }
  onClose = (option) => {
    this.props.onOptioned(option);
    this.setState({ dialogAnimation: this.props.dialogAnimation });
  }
  render() {
    let dialogRef;
    return (
      <PopupDialog
        ref={(id) => { this.props.onReference(id); }}
        dialogAnimation={this.state.dialogAnimation}
        width={scale(345)}
        height={scaleByVertical(height < 768 ? 245 : 150)}
        onClosed={() => { this.onClose(this.state.selectedOption); }}
      >
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', paddingLeft: 20, paddingTop: 10 }}>
          <Text style={[styles.infoDialogTitle, { color: 'black' }]}>Choose Developmental Level</Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Text style={{ color: 'black', fontSize: theme.screenWidth / 45, }} >
            Choose a level for conversation starters. You can change at any time.
          </Text>
        </View>
        <View style={{ flex: 3, justifyContent: 'center', paddingHorizontal: 20, marginTop: scaleByVertical(4) }}>
          <TouchableOpacity onPress={() => this.onSelected('baby')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleByVertical(3) }}>
            <View style={styles.checkbox}>
              <RadioButton
                  anmation={'bounceIn'}
                  size={10}
                  innerColor={'#999999'}
                  outerColor={'#999999'}
                  isSelected={this.state.selectedBaby}
                  onPress={() => this.onSelected('baby')}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: Colors.babyColor, marginLeft: Metrics.baseMargin }}>
                  Baby
              </Text>
              <Text style={{ color: Colors.babyColor, marginLeft: Metrics.doubleBaseMargin }}>
                  (6-18 months)
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onSelected('toddler')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleByVertical(5) }}>
          <View style={styles.checkbox}>
              <RadioButton
                  anmation={'bounceIn'}
                  size={10}
                  innerColor={'#999999'}
                  outerColor={'#999999'}
                  isSelected={this.state.selectedToddler}
                  onPress={() => this.onSelected('toddler')}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: Colors.toddlerColor, marginLeft: Metrics.baseMargin }}>
                  Toddler
                </Text>
              <Text style={{ color: Colors.toddlerColor, marginLeft: Metrics.doubleBaseMargin }}>
                  (12-24 months)
                </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onSelected('preschooler')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleByVertical(5) }}>
          <View style={styles.checkbox}>
              <RadioButton
                  anmation={'bounceIn'}
                  size={10}
                  innerColor={'#999999'}
                  outerColor={'#999999'}
                  isSelected={this.state.selectedPreschooler}
                  onPress={() => this.onSelected('preschooler')}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: Colors.preschoolerColor, marginLeft: Metrics.baseMargin }}>
                  Preschooler
                </Text>
              <Text style={{ color: Colors.preschoolerColor, marginLeft: Metrics.doubleBaseMargin }}>
                  (2-4 years)
                </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.closeButton, { marginBottom: Metrics.baseMargin, marginRight: Metrics.baseMargin }]}>
            <Button
              style={[Styles.buttonRadius, styles.dismissButton]}
              onPress={() => this.onClose(this.state.selectedOption)}
            >
              <Text style={[styles.infoDialogClose, { color: 'white' }]}>Close</Text>
            </Button>
        </View>
      </PopupDialog>
    );
  }
}

function bindAction(dispatch) {
  return {
    popRoute: key => dispatch(popRoute(key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
    setDevelopmentalLevel: developmentalLevel => dispatch(setPreference('developmentalLevel', developmentalLevel)),
    viewPack: pack => dispatch(viewPack(pack)),
    closePack: pack => dispatch(closePack(pack)),
    swipePage: (pack, story_id, page_id) => dispatch(swipePage(pack, story_id, page_id)),
    conversationOpen: (pack, story_id, page_id) => dispatch(conversationOpen(pack, story_id, page_id)),
    conversationClose: (pack, story_id, page_id) => dispatch(conversationClose(pack, story_id, page_id)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  pack: state.cardNavigation.routes[state.cardNavigation.routes.length - 1].pack,
  story: state.cardNavigation.routes[state.cardNavigation.routes.length - 1].story,
  developmentalLevel: state.preference.developmentalLevel,
  swipeEnabled: state.preference.swipeEnabled,
  language: state.preference.language,
});

export default connect(mapStateToProps, bindAction)(ShowPage);
