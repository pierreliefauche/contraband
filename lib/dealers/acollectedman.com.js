module.exports = {
  id: 'acollectedman.com',
  urls: [
    'https://www.acollectedman.com/collections/all',
  ],
  items: '.main-content .grid-uniform .grid__product',
  extract: {
    url: 'a@href',
    images: [
      'img.primary@data-src',
      'img.secondary@data-src',
    ],
    title: '.h6',
    description: 'img@alt',
    price: '.money',
    sold: {
      selector: '.grid__product-price',
      is: 'Sold'
    }
  }
};
