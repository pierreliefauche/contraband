import Model from 'models/_model';
import WatchCollection from 'models/watch-collection';
import xhr from 'xhr';
import config from 'config';

export default Model.extend({
  url: `${config.apiRoot}/user`,

  initialize() {
    if (config.fakeFbUser) {
      this.userId = 'fake';
      this.resetUser();
    }
    this.checkLoginStatus();
  },

  props: {
    lastVisitedAt: ['date', true, () => new Date()],
    favoriteIds: ['array', true, () => ([])],
  },

  session: {
    userId: ['string', false],
    postAuthCbs: ['array', 'true', () => ([])],
  },

  derived: {
    loggedIn: {
      deps: ['userId'],
      fn() {
        return Boolean(this.userId);
      },
    }
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
    this.userId = (res.status === 'connected' && res.authResponse && res.authResponse.userID);
    this.resetUser();
  },

  resetUser() {
    if (this.userId) {
      this.fetch();
      this.mayBumpLastVisitedAt();
      const cbs = this.postAuthCbs;
      this.postAuthCbs = [];
      cbs.forEach(cb => cb());
    }
    else {
      this.favorites.reset();
      this.postAuthCbs = [];
    }
  },

  requiresAuth(cb) {
    if (this.loggedIn) {
      return cb();
    }

    this.postAuthCbs.push(cb);
    this.login();
  },

  hasFavorited(watch) {
    return this.favoriteIds.includes(watch.getId());
  },

  hasSeen(watch) {
    const buffer = 12 * 3600 * 1000; // 12 hours in milliseconds
    return this.lastVisitedAt && watch && watch.createdAt.getTime() > (this.lastVisitedAt.getTime() - buffer);
  },

  mayBumpLastVisitedAt() {
    setTimeout(() => {
      xhr({
        method: 'PUT',
        url: `${this.url}/lastVisitedAt`,
      }, (err) => {
        if (err) {
          console.error('Failed to update last visited at')
        }
      });
    }, 10000);
  },

  addFavorite(watch) {
    if (!this.favoriteIds.includes(watch.getId())) {
      this.requiresAuth(() => {
        xhr({
          method: 'PUT',
          url: `${this.url}/favoriteIds/${encodeURIComponent(watch.getId())}`,
        }, (err) => {
          if (err) {
            console.error('Failed to add favorite');
            this.favoriteIds = this.favoriteIds.splice(id => id !== watch.getId());
          }
        });

        this.favoriteIds = this.favoriteIds.concat(watch.getId());
      });
    }
  },

  removeFavorite(watch) {
    if (this.favoriteIds.includes(watch.getId())) {
      this.requiresAuth(() => {
        xhr({
          method: 'DELETE',
          url: `${this.url}/favoriteIds/${encodeURIComponent(watch.getId())}`,
        }, (err) => {
          if (err) {
            console.error('Failed to remove favorite');
            this.favoriteIds = this.favoriteIds.concat(watch.getId());
          }
        });

        this.favoriteIds = this.favoriteIds.filter(id => id !== watch.getId());
      });
    }
  },
});
