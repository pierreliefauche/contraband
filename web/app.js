import app from 'ampersand-app';
import Router from './router';

export default app.extend({
  router: new Router(),

  init() {
    console.log('INIT');
    this.router.history.start({ pushState: true });
  },

  // This is a helper for navigating around the app.
  navigate(path) {
    var url = (path.charAt(0) === '/') ? path.slice(1) : path;
    this.router.history.navigate(url, {
      trigger: true,
    });
  },
});
