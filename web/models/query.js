import State from 'ampersand-state';

export default State.extend({
  session: {
    new: ['boolean', false, null],
    sold: ['boolean', false, false],
    brands: ['array', false, null],
    dealers: ['array', false, null],
    priceMin: ['number', false, null],
    priceMax: ['number', false, null],
    search: ['string', false, null],
  },

  filter(watch) {
    // New
    if (this.new != null) {
      if (Boolean(this.new) === app.state.user.hasSeen(watch)) {
        return false;
      }
    }

    // Sold
    if (this.sold != null) {
      if (Boolean(this.sold) !== Boolean(watch.sold)) {
        return false;
      }
    }

    // Brand
    if (Array.isArray(this.brands) && this.brands.length > 0) {
      if (!this.brands.includes(watch.brandId)) {
        return false;
      }
    }

    // Dealer
    if (Array.isArray(this.dealers) && this.dealers.length > 0) {
      if (!this.dealers.includes(watch.dealerId)) {
        return false;
      }
    }

    // Price Min
    if (this.priceMin != null) {
      if (!watch.priceAmount || this.priceMin > watch.priceAmount) {
        return false;
      }
    }

    // Price Max
    if (this.priceMax != null) {
      if (!watch.priceAmount || this.priceMax < watch.priceAmount) {
        return false;
      }
    }

    if (this.search) {
      if (!(watch.title && watch.title.toLowerCase().includes(this.search.toLowerCase()))) {
        return false;
      }
    }

    return true;
  },

  sort(watch, index) {
    return index
  },
});
