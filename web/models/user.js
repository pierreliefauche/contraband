import Model from 'models/_model';
import WatchCollection from 'models/watch-collection';
import config from 'config';

export default Model.extend({
  url: `${config.apiRoot}/user`,

  initialize() {
    this.checkLoginStatus();
  },

  props: {
    token: ['string', false],
  },

  session: {
    userId: ['string', false]
  },

  derived: {
    loggedIn: {
      deps: ['userId'],
      fn() {
        return Boolean(this.userId);
      },
    }
  },

  collections: {
    bookmarks: WatchCollection,
  },

  login() {
    if (typeof FB !== 'undefined') {
      FB.login(this.onLoginStatusChange.bind(this));
    }
  },

  checkLoginStatus() {
    if (typeof FB !== 'undefined') {
      FB.getLoginStatus(this.onLoginStatusChange.bind(this));
    }
  },

  onLoginStatusChange(res) {
    if (res.status === 'connected' && res.authResponse && res.authResponse.userID) {
      this.userId = res.authResponse.userId;
    }
    else {
      this.userId = null;
      this.bookmarks.reset();
    }
  },
});
