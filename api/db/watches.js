'use strict';

const log = global.log;
const ObjectID = require('mongodb').ObjectID;
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

    const now = Date.now();

    async.each(watches, (watch, cb) => {
      this.writeCargo.push({
        updateOne: {
          filter: {
            id: watch.id
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

  list(criteria = {}, options = {}, cb) {
    const limit = Math.max(10, Math.min(options.limit || 50, 100));

    const query = {};

    if (options.page) {
      query._id : {
        $lte: ObjectID.createFromHexString(options.page),
      };
    }

    let cursor = this.collection.find(query);

    // Limit (add 1 for paging)
    cursor.limit(limit + 1);

    // Sorting
    // By createdAt DESC (use _id because we batch insert)
    cursor.sort([['_id': -1]]);


    cursor.toArray((err, watches) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      const meta = {};

      if (watches.length > limit) {
        meta.nextPage = watches[limit]._id.toHexString();
        watches = watches.slice(0, limit);
      }

      return cb(null, watches, meta);
    });
  }
}

module.exports = WatchesStore;
