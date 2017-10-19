const log = global.log;
const moneyLib = require('money');
const request = require('request');

class Money {
  constructor() {
    // Init converter
    this.getConverter(() => {});
  }

  fetchRates(cb) {
    request({
      url: 'https://api.fixer.io/latest',
      json:true,
      gzip: true,
    }, (err, res, body) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      if (!(res && res.statusCode === 200)) {
        log.error('Error fetching Fixer.io rates');
        return cb({code: 500, message: 'Error fetching fixer.io rates'});
      }

      if (!(body.base && body.rates)) {
        log.error('Malformed Fixer.io rates');
        return cb({code: 500, message: 'Malformed fixer.io rates'});
      }

      return cb(null, body);
    });
  }

  getConverter(_cb) {
    if (this._converter) {
      return _cb(this._converter);
    }

    if (this._converterCbs) {
      this._converterCbs.push(_cb);
      return;
    }

    this._converterCbs = [_cb];

    const cb = (...args) => {
      const cbs = this._converterCbs;
      delete this._converterCbs;
      cbs.forEach(aCb => aCb(...args));
    };

    this.fetchRates((err, rates) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      this._converter = moneyLib;
      this._converter.base = rates.base;
      this._converter.rates = rates.rates;

      return cb(null, this._converter);
    });
  }

  convert(from, toCurrency, cb) {
    if (from.currency === toCurrency) {
      return cb(null, from.amount);
    }

    this.getConverter((err, converter) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      const toAmount = converter.convert(from.amount, { from: from.currency, to: toCurrency });
      return cb(null, Math.round(toAmount));
    });
  }
}

module.exports = new Money();
