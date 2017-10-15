module.exports = {
  id: 'metersfirst.com',
  urls: [
    'http://www.metersfirst.com/watches/',
  ],
  items: '#productList a.product',
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

  postExtract(item) {
    if (item.price) {
      item.price = '$ ' + item.price;
    }
    return item;
  },
};
