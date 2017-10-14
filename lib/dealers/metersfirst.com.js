module.exports = {
  id: 'metersfirst.com',
  urls: [
    'http://www.metersfirst.com/watches/',
  ],
  items: '#productList a.product',
  item: {
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

  postParsing(item) {
    if (item.price) {
      item.price = '$ ' + item.price;
    }
    return item;
  },
};
