module.exports = {
  id: 'analogshift.com',
  urls: [
    'https://shop.analogshift.com/collections/watches/',
    'https://shop.analogshift.com/collections/watches/?page=2'
  ],
  items: '.watches.collection a.watch',
  extract: {
    url: '@href',
    images: [
      'img@data-src',
    ],
    title: '.title',
    description: '.detail',
    price: '.price',
  },

  postClean(item) {
    if (item && item.price && item.price.amount < 400) {
      return null;
    }
    return item;
  },
};
