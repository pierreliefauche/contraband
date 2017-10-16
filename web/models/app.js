import State from 'ampersand-state';
import User from 'models/user';
import BrandCollection from 'models/brand-collection';
import DealerCollection from 'models/dealer-collection';
import WatchCollection from 'models/watch-collection';

export default State.extend({
  props: {},

  session: {
    lastVisitDate: ['date', false],
  },

  derived: {},

  collections: {
    brands: BrandCollection,
    dealers: DealerCollection,
    watches: WatchCollection,
  },

  children: {
    user: User,
  }

  initialize() {
    this.initLastVisitDate();
    return this;
  },

  getStorage(key) {
    return window.localStorage.getItem(key);
  },

  setStorage(key, value) {
    if (typeof key !== 'string' && typeof value === 'undefined') {
      return Object.keys(key).forEach(k => this.setStorage(k, key[k]));
    }

    try {
      window.localStorage.setItem(key, value);
    }
    catch (e) {
      console.log('Error saving to Local Storage:', e);
    }
  },

  initLastVisitDate() {
    this.lastVisitDate = new Date(this.getStorage('lastVisitDate') || (Date.now() - 15 * 24 * 3600 * 1000));
    this.setStorage('lastVisitDate', new Date());
  },

  fetchInitialData() {
    this.brands.fetch();
    this.dealers.fetch();
    this.watches.fetch();
  },
});
