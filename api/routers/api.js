'use strict';

const log = global.log;
const express = require('express');
const async = require('async');
const brands = require('../../lib').brands;
const dealers = require('../../lib').dealers;
const Scraper = require('../../lib').Scraper;

module.exports = (() => {
  const self = (config = {}) => {
    self.db = config.db;

    const router = new express.Router();

    router.get('/brands', self.listBrands);
    router.get('/dealers', self.listDealers);
    router.get('/watches', self.listWatches);

    router.get('/scrap/:dealerId', self.scrapDealer);
    router.get('/scrap-and-save/all', self.scrapAndSaveDealers);

    router.use(self.failTo404);
    return router;
  };

  self.getLimit = (req, defaultLimit) => {
    if (typeof req.query.limit === 'string') {
      const int = parseInt(req.query.limit, 10);
      if (!isNaN(int)) {
        return int;
      }
    }

    return defaultLimit;
  }

  self.listBrands = (req, res) => {
    return res.json(brands.all().map(brand => ({
      id: brand.id,
      name: brand.name,
    })));
  };

  self.listDealers = (req, res) => {
    return res.json(dealers.all().map(dealer => ({
      id: dealer.id,
      name: dealer.name,
      url: dealer.urls[0],
    })));
  };

  self.listWatches = (req, res, next) => {
    const criteria = {};
    const options = { page: req.query.page, limit: self.getLimit(req) };

    self.db.watches.list(criteria, options, (err, watches, meta) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      if (meta.nextPage) {
        res.set('X-Next-Page', meta.nextPage);
      }

      return res.json(watches);
    });
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

        return self.db.watches.upsert(items, cb);
      });
    }, (err) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      return res.status(204).send();
    });
  };

  self.failTo404 = (req, res, next) => {
    return next({ code: 404, message: 'Invalid request' });
  };

  return self;
})();
