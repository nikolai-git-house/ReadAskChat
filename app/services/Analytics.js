import Analytics from 'react-native-firebase-analytics';

export const LOGIN = 'login';
export const VIEW_ITEM = 'view_item';
export const VIEW_PAGE = 'view_page';
export const VIEW_PACK = 'view_pack';
export const CLOSE_PACK = 'close_pack';
export const SWIPE_PAGE = 'swipe_page';
export const CONVERSATION_OPEN = 'conversation_open';
export const CONVERSATION_CLOSE = 'promt';
export const VIEW_ITEM_LIST = 'view_item_list';
export const INITIATE_PURCHASE_PACK = 'initiate_purchase_pack';
export const DONE_PURCHASE_PACK = 'done_purchase_pack';

export default class AnalyticsWrapper {
  constructor() {
    this.login = this.login.bind(this);
    this.setCredential = this.setCredential.bind(this);
    this.viewPage = this.viewPage.bind(this);
    this.viewItem = this.viewItem.bind(this);
    this.viewItemList = this.viewItemList.bind(this);
    this.viewPack = this.viewPack.bind(this);
    this.swipePage = this.swipePage.bind(this);
    this.closePack = this.closePack.bind(this);
    this.conversationOpen = this.conversationOpen.bind(this);
    this.conversationClose = this.conversationClose.bind(this);
    this.initiatePurchasePack = this.initiatePurchasePack.bind(this);
    this.donePurchasePack = this.donePurchasePack.bind(this);
  }
  async login(email) {
    this.setCredential(email);
    return Analytics.logEvent(LOGIN);
  }
  async logEvent(eventName, eventProps) {
    return Analytics.logEvent(eventName, eventProps);
  }
  setCredential(email) {
    return Promise.all([
      Promise.resolve(Analytics.setUserId(email)),
      Promise.resolve(Analytics.setScreenName(email)),
    ]);
  }
  viewPage(page_name = '') {
    return this.logEvent(VIEW_PAGE, {
      page_name,
    });
  }
  viewItem({ pack_id, pack_name, user }) {
    return this.logEvent(VIEW_ITEM, {
      item_id: pack_id,
      item_description: pack_name,
      promo_code: user.promo.code,
    });
  }
  viewItemList({ list_name, user }) {
    return this.logEvent(VIEW_ITEM_LIST, {
      item_category: list_name,
      promo_code: user.promo.code,
    });
  }
  viewPack({ pack_id, user, developmentalLevel, email }) {
    return this.logEvent(VIEW_PACK, {
      pack_id,
      email,
      promo_code: user.promo.code,
      developmentalLevel,
    });
  }
  closePack({ pack_id, user, email, developmentalLevel, duration }) {
    return this.logEvent(CLOSE_PACK, {
      pack_id,
      email,
      promo_code: user.promo.code,
      duration,
      developmentalLevel,
    });
  }
  swipePage({ pack_id, user, story_id, email, page_id, developmentalLevel, duration }) {
    return this.logEvent(SWIPE_PAGE, {
      pack_id,
      promo_code: user.promo.code,
      story_id,
      duration,
      email,
      developmentalLevel,
      page_id,
    });
  }
  conversationOpen({ pack_id, user, story_id, email, page_id, developmentalLevel, duration }) {
    return this.logEvent(CONVERSATION_OPEN, {
      pack_id,
      promo_code: user.promo.code,
      story_id,
      developmentalLevel,
      email,
      page_id,
    });
  }
  conversationClose({ pack_id, user, story_id, email, page_id, developmentalLevel, duration }) {
    return this.logEvent(CONVERSATION_CLOSE, {
      pack_id,
      promo_code: user.promo.code,
      story_id,
      duration,
      email,
      developmentalLevel,
      page_id,
    });
  }
  initiatePurchasePack({ packs, user, gross_amount, is_bundle, email }) {
    return this.logEvent(INITIATE_PURCHASE_PACK, {
      packs,
      promo_code: user.promo.code,
      is_bundle,
      gross_amount,
      email,
    });
  }
  donePurchasePack({ packs, user, gross_amount, is_bundle, email }) {
    return this.logEvent(DONE_PURCHASE_PACK, {
      packs,
      promo_code: user.promo.code,
      is_bundle,
      gross_amount,
      email,
    });
  }
}
