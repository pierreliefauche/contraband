'use strict';

import baseConfig from './base';

const config = {
  environment: 'production',
  appEnv: 'dist',
  apiRoot: `${window.location.href.split('/').slice(0, 3).join('/')}/api`,
  sentryPublicDsn: 'https://efabfaffb0534f3c8e143dffe3ac7c1b@sentry.io/230440',
  sentryRelease: __webpack_hash__,
  mixpanelToken: null,
  fbAppId: '138867796749008',
};

export default Object.freeze(Object.assign({}, baseConfig, config));

