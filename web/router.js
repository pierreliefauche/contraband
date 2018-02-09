import app from 'ampersand-app';
import Router from 'ampersand-router';
import ReactDOM from 'react-dom';
import WatchList from 'views/watch/list';
import Layout from 'views/layout';
import Query from 'models/query';

export default Router.extend({
  routes: {
    '': 'listWatches',
    'favorites/': 'listFavorites',
    '(*path)': 'catchAll',
  },

  normalizePath(path) {
    if (!path.endsWith('/')) {
      path += '/';
    }
    if (path.startsWith('/')) {
      path = path.substr(1);
    }
    return path;
  },

  isCurrent(path = '') {
    return this.normalizePath(path) === this.normalizePath(window.location.pathname);
  },

  navigateTo(...args) {
    return this.redirectTo(...args);
  },

  redirectTo(path = '') {
    return Router.prototype.redirectTo.call(this, this.normalizePath(path));
  },

  renderPage(page, options = { layout: true }) {
    if (options.layout) {
      page = (
        <Layout>{page}</Layout>
      );
    }

    ReactDOM.render(page, document.getElementById('app'));
  },

  listWatches() {
    app.query = new Query();
    this.renderPage(<WatchList watches={app.state.watches} query={app.query} />);
  },

  listFavorites() {
    app.state.user.requiresAuth(() => {
      app.query = new Query({ sold: null });
      this.renderPage(<WatchList watches={app.state.user.favorites} query={app.query} />);
    });
  },

  catchAll() {
    this.redirectTo('');
  },
});
