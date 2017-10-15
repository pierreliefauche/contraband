import Collection from 'ampersand-rest-collection';
import xhrMixin from 'helpers/xhr-mixin';

export default Collection.extend(xhrMixin, {
  parse(data, options) {
    this.nextPage = data.meta && data.meta.nextPage;
    return data.data || data;
  },

  getOptimist(id) {
    var m = this.get(id);

    if (!m && id) {
      m = new this.model({ id });
      this.add(m);
      m.fetch();
    }

    return m;
  },

  mayFetch() {
    if (!this.fetched) {
      return this.fetch();
    }
  },

  fetch(options = {}) {
    this.fetched = true;
    return Collection.prototype.fetch.call(this, options);
  },

  hasNextPage() {
    return Boolean(this.nextPage);
  },

  fetchNextPage() {
    if (this.nextPage) {
      this.fetch({
        reset: false,
        add: true,
        remove: false,
        merge: true,
        data: {
          page: this.nextPage,
        },
      });
    }
  },
});
