'use strict';

const log = global.log;
const ObjectID = require('mongodb').ObjectID;
const async = require('async');

class UsersStore {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
  }

  // Lazy-load collection
  get collection() {
    if (!this._collection) {
      this._collection = this.mongoClient.collection('users');
    }

    return this._collection;
  }

  findById(userId, cb) {
    const query = {
      _id: userId,
    };

    this.collection.findOne(query, (err, user) => {
      return cb(err, user);
    });
  }

  patch(userId, patch, cb) {
    patch.$set = patch.$set || {};
    patch.$set.updatedAt = new Date();

    patch.$setOnInsert = {
      createdAt: new Date(),
    };

    this.collection.updateOne({_id: userId}, patch, {upsert: true}, cb);
  }
}

module.exports = UsersStore;
