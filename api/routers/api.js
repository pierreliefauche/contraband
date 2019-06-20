'use strict';

const log = global.log;
const express = require('express');
const async = require('async');
const { fbAuth } = require('../middlewares');
const { brands, dealers, Scraper, money } = require('../../lib');

module.exports = (() => {
  const self = (config = {}) => {
    self.db = config.db;

    const router = new express.Router();

    router.get('/brands', self.listBrands);
    router.get('/dealers', self.listDealers);
    router.get('/watches', self.listWatches);
    router.get('/watches/:watchId', self.getWatch);

    router.use('/user', fbAuth.requireUser());
    router.get('/user', self.getUser);
    router.put('/user/lastVisitedAt', self.bumpUserLastVisitedAt);
    router.put('/user/favoriteIds/:watchId', self.addUserFavorite);
    router.delete('/user/favoriteIds/:watchId', self.deleteUserFavorite);

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

  self.formatWatch = (watch, cb) => {
    if (!watch) {
      return cb(null, watch);
    }
    
    if (!watch.price) {
      return cb(null, watch);
    }

    if (watch.price.value && !watch.price.amount) {
      watch.price.amount = watch.price.value;
      delete watch.price.value;
    }

    if (!watch.price.amount) {
      delete watch.price;
      return cb(null, watch);
    }

    money.convert(watch.price, 'USD', (err, usdAmount) => {
      if (err) {
        log.error(err);
        // ignore error
      }

      if (usdAmount) {
        watch.price.usd = usdAmount;
      }

      return cb(null, watch);
    });
  };

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
    const options = { page: req.query.page, limit: self.getLimit(req) };
    
    const criteria = {
      sold: false,
    };

    self.db.watches.list(criteria, options, (err, watches, meta) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      async.map(watches, self.formatWatch, (err, formatedWatches) => {
        if (err) {
          log.error(err);
          return next(err);
        }

        return res.json({
          data: formatedWatches.map(w => w),
          meta: {
            nextPage: meta.nextPage
          },
        });
      });
    });
  };

  self.getWatch = (req, res, next) => {
    self.db.watches.findById(req.params.watchId, (err, watch) => {
      if (err) {
        log.error(err);
        return next(err);
      }
      
      if (!watch) {
        log.error('Watch not found', req.params.watchId);
        return next({code: 404, message: 'Watch not found'});
      }

      self.formatWatch(watch, (err, formatedWatch) => {
        if (err) {
          log.error(err);
          return next(err);
        }

        return res.json(formatedWatch);
      });
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
          // Do not throw error
          return cb();
        }

        return self.db.watches.upsert(items, cb);
      });
    }, (err) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      // Some watches disappear from scraping once sold,
      // so mark the stale watches as such.
      self.db.watches.markGhostsAsSold(err => {
        if (err) {
          log.error(err);
          return next(err);
        }

        return res.status(204).send();
      });
    });
  };

  self.getUser = (req, res, next) => {
    self.db.users.findById(req.user.id, (err, user) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      return res.json(user || {});
    });
  };

  self.bumpUserLastVisitedAt = (req, res, next) => {
    const patch = {
      $set: { lastVisitedAt: new Date() },
    };

    self.db.users.patch(req.user.id, patch, (err) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      return res.status(202).send();
    });
  };

  self.addUserFavorite = (req, res, next) => {
    const patch = {
      $addToSet: { favoriteIds: req.params.watchId },
    };

    self.db.users.patch(req.user.id, patch, (err) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      return res.status(202).send();
    });
  };

  self.deleteUserFavorite = (req, res, next) => {
    const patch = {
      $pull: { favoriteIds: req.params.watchId },
    };

    self.db.users.patch(req.user.id, patch, (err) => {
      if (err) {
        log.error(err);
        return next(err);
      }

      return res.status(202).send();
    });
  };

  self.failTo404 = (req, res, next) => {
    return next({ code: 404, message: 'Invalid request' });
  };

  return self;
})();
