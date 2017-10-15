// Styles
import 'normalize.css';
import './styles/main.scss';

import domReady from 'domready';
import Raven from 'raven-js';
import config from 'config';

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

