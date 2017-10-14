module.exports = {
  id: '1025vintage.com',
  urls: [
    'https://shop.1025vintage.com/collections/watches',
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
