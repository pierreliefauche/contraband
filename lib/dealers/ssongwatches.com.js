module.exports = {
  id: 'ssongwatches.com',
  urls: [
    'https://www.ssongwatches.com/collections/watches',
  ],
  items: '#collection-content .global-product-each',
  item: {
    url: 'a@href',
    images: [
      'img.main-image@src',
      'img.sub-image@src',
    ],
    title: '.header',
    price: '.global-price',
    sold: {
      selector: '.product-add-button',
      is: 'Sold'
    }
  },
};
