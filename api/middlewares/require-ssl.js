'use strict';

const utils = require('./utils');

/**
 * Redirects non-secure requests to HTTPS.
 *
 * Looks at various aspects of the request and determines if the request is
 * already secure. If it is not secure, an error is returned.
 */

const config = require('../config');

function getReqUrl(req, ssl = true) {
  return `http${ssl ? 's' : ''}://${config.host}${req.originalUrl}`;
}

module.exports = function requireSSL(shouldSsl = true) {
  return (req, res, next)=> {
    if (Boolean(utils.isReqSecure(req)) === Boolean(shouldSsl)) {
      return next();
    }
    return res.redirect(getReqUrl(req, shouldSsl));
  };
};
