import Model from 'models/_model';
import config from 'config';

export default Model.extend({
  idAttribute: '_id',

  parse: function() {
    const data = Model.prototype.parse.apply(this, arguments);
    data.dealerUrl = data.url;
    delete data.url;
    return data;
  },

  props: {
    _id: ['string', true],
    dealerUrl: ['string', true],
    title: ['string', true],
    description: ['string', false],
    images: ['array', true],
    sold: ['boolean', true, false],
    price: ['object', false],
    dealerId: ['string', true],
    brandId: ['string', false],
    createdAt: ['date', true],
    updatedAt: ['date', true],
  },

  derived: {
    dealer: {
      deps: ['dealerId'],
      fn() {
        return app.state.dealers.getOptimist(this.dealerId);
      },
    },
    brand: {
      deps: ['brandId'],
      fn() {
        return app.state.brands.getOptimist(this.brandId);
      },
    },
    primaryImageUrl: {
      deps: ['images'],
      fn() {
        return this.images[0];
      },
    },
    secondaryImageUrl: {
      deps: ['images'],
      fn() {
        return this.images[1];
      },
    },
    priceLabel: {
      deps: ['price'],
      fn() {
        if (!this.price) {
          return '';
        }

        const currency = this.price.usd ? 'USD' : this.price.currency;
        const amount = this.price.usd ? this.price.usd : this.price.amount;

        const cur = {'USD': '$', 'EUR': '€', 'GBP': '£'}[currency] || currency || '$';
        return `${cur} ${amount.toLocaleString()}`;
      }
    },
  },
});
