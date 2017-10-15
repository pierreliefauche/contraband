const brands = require('./brands');
Object.keys(brands).forEach(brandId => brands[brandId].id = brandId);

const self = {
  get(brandId) {
    return brands[brandId];
  },

  getLevel(brandId) {
    return self.get(brandId).level || 0;
  },

  contains(text, reference) {
    text = text.trim().toLowerCase();
    const i = text.indexOf(reference);
    return (i >= 0 && !/[a-z]/.test(text.charAt(i - 1)) && !/[a-z]/.test(text.charAt(i - 1)));
  },

  extractBrandId(text) {
    const contains = self.contains.bind(self, text);

    const brand = Object.keys(brands).reduce((found, brandId) => {
      const brand = self.get(brandId);

      if (contains(brandId) || (brand.alias && brand.alias.some(contains))) {
        if (!(found && self.getLevel(found.id) < self.getLevel(brandId))) {
          found = brand;
        }
      }

      return found;
    }, null);

    return brand && brand.id;
  },
};

module.exports = self;
