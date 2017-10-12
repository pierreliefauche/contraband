module.exports = {
  id: 'analogshift.com',
  urls: [
    'https://shop.analogshift.com/collections/watches/',
    'https://shop.analogshift.com/collections/watches/?page=2'
  ],
  items: '.watches.collection a.watch',
  item: {
    url: '@href',
    images: [
      'img@data-src',
    ],
    title: '.title',
    description: '.detail',
    price: '.price',
  }
};
