'use strict';

import baseConfig from './base';

const config = {
  environment: 'development',
  appEnv: 'dev',
  apiRoot: `http://${window.location.hostname}:8080/api`,
  sentryPublicDsn: null,
  sentryRealase: 'dev',
  mixpanelToken: null,
};

export default Object.freeze(Object.assign({}, baseConfig, config));
