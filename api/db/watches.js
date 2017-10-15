'use strict';

const log = global.log;
const async = require('async');

class WatchesStore {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;

  }

  // Lazy-load collection
  get collection() {
    if (!this._collection) {
      this._collection = this.mongoClient.collection('watches');
    }

    return this._collection;
  }

  get writeCargo() {
    if (!this._writeCargo) {
      this._writeCargo = async.cargo(this.batch.bind(this), 30);
    }

    return this._writeCargo;
  }

  batch(operations, cb) {
    this.collection.bulkWrite(operations, (err, r) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      log.info(`Did batch operations inserted=${r.nInserted} upserted=${r.nUpserted}`);
      return cb(null);
    });
  }

  findById(watchId, cb) {
    const query = {
      _id: watchId.toString(),
    };

    this.collection.findOne(query, (err, watch) => {
      return cb(err, watch);
    });
  }

  listByDealerId(dealerId, cb) {
    const query = {
      dealerid: dealerId.toString(),
    };

    const queryOpts = {
      sort: { createdAt: 1 },
    };

    this.collection.find(query, queryOpts).toArray((err, watches) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      return cb(null, watches);
    });
  }

  upsert(watches, cb) {
    watches = [].concat(watches);

    async.each(watches, (watch, cb) => {
      this.writeCargo.push({
        updateOne: {
          filter: {
            _id: watch.id
          },
          update: {
            $setOnInsert: {
              createdAt: new Date()
            },
            $set: {
              ...watch,
              _id: watch.id,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        }
      }, cb);
    }, cb);
  }
}

module.exports = WatchesStore;