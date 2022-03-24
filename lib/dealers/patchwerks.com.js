module.exports = {
  id: 'patchwerks.com',
  urls: [
    'https://patchwerks.com/collections/used?page=1',
    'https://patchwerks.com/collections/used?page=2',
    'https://patchwerks.com/collections/used?page=3',
    'https://patchwerks.com/collections/used?page=4',
    'https://patchwerks.com/collections/used?page=5',
    'https://patchwerks.com/collections/used?page=6',
    'https://patchwerks.com/collections/used?page=7',
    'https://patchwerks.com/collections/used?page=8',
    'https://patchwerks.com/collections/used?page=9',
  ],
  items: '#collection .product-list .product-block',
  extract: {
    url: '.image a@href',
    images: [
      '.image noscript img@src',
    ],
    title: '.image img@alt',
    price: '.price .amount'
  },
};
