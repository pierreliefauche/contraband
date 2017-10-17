import Model from 'models/_model';
import WatchCollection from 'models/watch-collection';
import xhr from 'xhr';
import config from 'config';

export default Model.extend({
  url: `${config.apiRoot}/user`,

  initialize() {
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

  collections: {
    favorites: WatchCollection,
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
      this.fetch();
      this.mayBumpLastVisitedAt();

      const cbs = this.postAuthCbs;
      this.postAuthCbs = [];
      cbs.forEach(cb => cb());
    }
    else {
      this.userId = null;
      this.favorites.reset();
      this.postAuthCbs = [];
    }

    this.favorites.reset();
  },

  requiresAuth(cb) {
    if (this.loggedIn) {
      return cb();
    }

    this.postAuthCbs.push(cb);
    this.login();
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
    if (!this.favoriteIds.includes(watch.id)) {
      this.requiresAuth(() => {
        xhr({
          method: 'PUT',
          url: `${this.url}/favoriteIds/${encodeURIComponent(watch.id)}`,
        }, (err) => {
          if (err) {
            console.error('Failed to add favorite');
            this.favoriteIds = this.favoriteIds.filter(id => id !== watch.id);
            watch.favorited = false;
          }
        });

        this.favoriteIds.push(watch.id);
        watch.favorited = true;
      });
    }
  },

  removeFavorite(watch) {
    if (this.favoriteIds.includes(watch.id)) {
      this.requiresAuth(() => {
        xhr({
          method: 'DELETE',
          url: `${this.url}/favoriteIds/${encodeURIComponent(watch.id)}`,
        }, (err) => {
          if (err) {
            console.error('Failed to remove favorite');
            this.favoriteIds.push(watch.id);
            watch.favorited = true;
          }
        });

        this.favoriteIds = this.favoriteIds.filter(id => id !== watch.id);
        watch.favorited = false;
      });
    }
  },
});
