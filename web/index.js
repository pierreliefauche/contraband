// Styles
import 'normalize.css';
import './styles/main.scss';

import domReady from 'domready';
import Raven from 'raven-js';
import config from 'config';

// FB login
if (config.fbAppId) {
  window.fbAsyncInit = function() {
    FB.init({
      appId: config.fbAppId,
      cookie: true,
      xfbml: true,
      version: 'v2.10'
    });
    FB.AppEvents.logPageView();
  };


  (function(d, id){
    let js, b = d.body;
    if (!d.getElementById(id)) {
      js = d.createElement('script'); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      b.appendChild(js);
    }
  }(document, 'facebook-jssdk'));
}

// Sentry tracking
if (config.sentryPublicDsn) {
  Raven.config(config.sentryPublicDsn, {
    environment: config.environment,
    release: config.sentryRelease,
  }).install();
}

import app from './app';

window.app = app;
domReady(app.init.bind(app));

