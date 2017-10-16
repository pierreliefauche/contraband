'use strict';

const MongoClient = require('mongodb').MongoClient;
const WatchesStore = require('./watches');
const UsersStore = require('./users');

exports.init = (options, cb)=> {
  MongoClient.connect(options.url, (err, mongoClient)=> {
    if (err) {
      return cb(err);
    }

    return cb(null, {
      watches: new WatchesStore(mongoClient),
      users: new UsersStore(mongoClient),
    });
  });
};
