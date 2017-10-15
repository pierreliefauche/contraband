'use strict';

const log = global.log;
const express = require('express');
const async = require('async');
const dealers = require('../../lib').dealers;
const Scraper = require('../../lib').Scraper;

module.exports = (() => {
  const self = (config = {}) => {
    const router = new express.Router();

    router.get('/scrap/:dealerId', self.scrapDealer);
    router.get('/scrap-and-save/all', self.scrapAndSaveDealers);

    router.use(self.failTo404);
    return router;
  };

  self.scrapDealer = (req, res, next) => {
    const dealer = dealers.get(req.params.dealerId);
    if (!dealer) {
      return next({ code: 404, message: 'Invalid dealerId' });
    }

    const scraper = new Scraper(dealer);
    scraper.scrap((err, items) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      return res.json(items);
    });
  };

  self.scrapAndSaveDealers = (req, res, next) => {
    async.each(dealers.all(), (dealer, cb) => {
      const scraper = new Scraper(dealer);
      scraper.scrap((err, items) => {
        if (err) {
          log.error(err);
          return cb(err);
        }

        // TODO: save items

        return cb();
      });
    }, next);
  };

  self.failTo404 = (req, res, next) => {
    return next({ code: 404, message: 'Invalid request' });
  };

  return self;
})();
