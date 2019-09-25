module.exports = {
  id: 'lunaroyster.com',
  urls: [
    'https://lunaroyster.com/shop/',
  ],
  items: '.products .product',
  extract: {
    url: '.box-image a@href',
    images: [
      '.box-image img@data-src',
    ],
    title: '.product-title a',
    price: '.price',
    sold: {
      selector: '.sold-out',
      is: 'sold out'
    }
  },
};
