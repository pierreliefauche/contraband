'use strict';

// const log = global.log;
const express = require('express');
const serveStatic = require('serve-static');

module.exports = (() => {
  const self = (config = {}) => { // eslint-disable-line no-unused-vars
    self.serveStatic = serveStatic(config.root);

    const router = new express.Router();
    router.use(self.serveStatic);
    router.use(self.rewriteToIndex, self.serveStatic);
    return router;
  };

  self.rewriteToIndex = (req, res, next) => {
    req.url = req.baseUrl + '/';
    return next();
  };

  return self;
})();
