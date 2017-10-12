module.exports = {
  id: 'watchsteez.com',
  urls: [
    'https://shop.watchsteez.com/collections/watches',
  ],
  items: '.watches.collection a.watch',
  item: {
    url: '@href',
    images: [
      'img@src',
    ],
    title: '.title',
    description: '.detail',
    price: '.price',
  }
};
