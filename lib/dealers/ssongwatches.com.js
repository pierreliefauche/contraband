module.exports = {
  id: 'ssongwatches.com',
  urls: [
    'https://www.ssongwatches.com/collections/watches?page=1',
    'https://www.ssongwatches.com/collections/watches?page=2',
    'https://www.ssongwatches.com/collections/watches?page=3',
    'https://www.ssongwatches.com/collections/watches?page=4',
    'https://www.ssongwatches.com/collections/watches?page=5',
    'https://www.ssongwatches.com/collections/watches?page=6',
  ],
  items: '#collection-content .global-product-each',
  extract: {
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
