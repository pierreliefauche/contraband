import Model from 'ampersand-model';
import xhrMixin from 'helpers/xhr-mixin';

let app = require('ampersand-app');

export default Model.extend(xhrMixin, {
  idAttribute: 'id',

  parse(data) {
    return data.data || data;
  },

  mayFetch() {
    if (!this.fetched) {
      return this.fetch();
    }
  },

  fetch: function() {
    if (!this.xhrFetching) {
      this.fetched = true;
      return Model.prototype.fetch.apply(this, arguments);
    }
  },

  removeFromCollection() {
    if (this.collection) {
      this.collection.remove(this);
    }
  },
});
