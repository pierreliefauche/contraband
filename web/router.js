import app from 'ampersand-app';
import Router from 'ampersand-router';
import ReactDOM from 'react-dom';
import HomePage from 'views/home-page';
import WatchList from 'views/watch/list';
import Layout from 'views/layout';

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

  renderPage(page, options = { layout: true }) {
    if (options.layout) {
      page = (
        <Layout>{page}</Layout>
      );
    }

    ReactDOM.render(page, document.getElementById('app'));
  },

  listWatches() {
    this.renderPage(<WatchList watches={app.state.watches} />);
  },

  catchAll() {
    this.redirectTo('watches');
  },
});
