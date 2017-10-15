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

  deleteNulls(object) {
    Object.keys(object).forEach(k => {
      if (object[k] == null) {
        delete object[k];
      }
    });

    return object;
  }

  upsert(watches, cb) {
    watches = [].concat(watches);

    let at = Date.now();

    async.each(watches, (watch, cb) => {
      at -= 100;
      const now = new Date(at);
      this.writeCargo.push({
        updateOne: {
          filter: {
            _id: watch.id
          },
          update: {
            $setOnInsert: {
              createdAt: now,
            },
            $set: {
              ...this.deleteNulls(watch),
              _id: watch.id,
              updatedAt: now,
            },
          },
          upsert: true,
        }
      }, cb);
    }, cb);
  }
}

module.exports = WatchesStore;
