'use strict';

const log = global.log;
const crypto = require('crypto');

const signWithSecret = (secret, str) => {
  let signature = crypto.createHmac('sha256', secret).update(str).digest('base64');
  signature = signature.replace(/=/g, '');
  signature = signature.replace(/\//g, '_');
  return signature;
};

module.exports = function fbAuth(fbApp = {}) {
  if (!(fbApp.id && fbApp.secret)) {
    return (req, res, next) => { next(); };
  }

  const sign = signWithSecret.bind(this, fbApp.secret);

  return (req, res, next) => {
    const token = req.get(`fbsr_${fbApp.id}`);
    if (token) {
      const [signature, payload] = token.split('.');
      if (signature === sign(payload)) {
        try {
          req.user = {
            id: JSON.parse(Buffer.from(payload, 'base64').toString('utf8')).user_id,
          };
        }
        catch(e) {
          log.error(e);
        }
      }
    }

    return next();
  };
};

module.exports.requireUser = function requireUser() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send();
    }

    return next();
  };
};
