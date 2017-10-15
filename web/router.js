import app from 'ampersand-app';
import Router from 'ampersand-router';
import ReactDOM from 'react-dom';
import HomePage from 'views/home-page';
import WatchList from 'views/watch/list';

export default Router.extend({
  routes: {
    'watches/': 'listWatches',
    '': 'catchAll',
    '(*path)': 'catchAll',
  },

  redirectTo(fragment) {
    if (!fragment.endsWith('/')) {
      fragment += '/';
    }
    if (fragment.startsWith('/')) {
      fragment = fragment.substr(1);
    }
    return Router.prototype.redirectTo.call(this, fragment);
  },

  renderPage(page) {
    ReactDOM.render(page, document.getElementById('app'));
  },

  listWatches() {
    this.renderPage(<WatchList watches={app.state.watches} />, {layout: false})
  },

  catchAll() {
    this.redirectTo('watches');
  },
});
