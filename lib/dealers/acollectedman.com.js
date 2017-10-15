module.exports = {
  id: 'acollectedman.com',
  urls: [
    'https://www.acollectedman.com/collections/all',
  ],
  items: '.main-content .grid-uniform .grid__product',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: '.h6',
    price: '.money',
    sold: {
      selector: '.grid__product-price',
      is: 'Sold'
    }
  }
};
