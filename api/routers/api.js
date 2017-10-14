'use strict';

const log = global.log;
const express = require('express');

module.exports = (() => {
  const self = (config = {}) => {
    const router = new express.Router();

    router.use(self.failTo404);
    return router;
  };

  self.failTo404 = (req, res, next) => {
    return next({ code: 404, message: 'Invalid request' });
  };

  return self;
})();
