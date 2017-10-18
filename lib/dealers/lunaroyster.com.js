module.exports = {
  id: 'lunaroyster.com',
  urls: [
    'https://www.lunaroyster.com/watches',
  ],
  items: '#productList .product',
  extract: {
    url: '@href',
    images: [
      '.product-image img@data-src',
    ],
    title: '.product-title',
    price: '.product-price',
    sold: {
      selector: '.sold-out',
      is: 'sold out'
    }
  },
};
