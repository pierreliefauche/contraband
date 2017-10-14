module.exports = {
  id: 'mentawatches.com',
  urls: [
    'https://mentawatches.com/shop/?orderby=date',
  ],
  items: '#main-content ul.products > li.product',
  item: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: 'h2',
    price: '.price',
    sold: {
      selector: '.price',
      is: 'SOLD'
    }
  }
};
