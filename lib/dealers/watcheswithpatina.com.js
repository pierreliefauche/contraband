module.exports = {
  id: 'watcheswithpatina.com',
  urls: [
    'https://shop.watcheswithpatina.com/collections/watches',
    'https://shop.watcheswithpatina.com/collections/archives',
  ],
  items: '.watches .watch',
  extract: {
    uniques: [
      '@data-id',
    ],
    url: '@href',
    images: [
      '.img-wrapper img.thumb@src',
    ],
    title: '.title',
    description: '.detail',
    price: '.price',
    sold: {
      selector: '.sold@class',
      includes: 'sold'
    }
  },
};
