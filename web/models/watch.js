import Model from 'models/_model';

export default Model.extend({
  idAttribute: '_id',

  url() {
    return `${config.apiRoot}/watches/${encodeURIComponent(this.getId())}`;
  },

  props: {
    _id: ['string', true],
    url: ['string', true],
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

        const cur = {'USD': '$', 'EUR': '€', 'GBP': '£'}[this.price.currency] || this.price.currency || '$';
        return `${cur} ${this.price.value.toLocaleString()}`;
      }
    },
  },
});
