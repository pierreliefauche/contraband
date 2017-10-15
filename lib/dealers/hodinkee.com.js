module.exports = {
  id: 'hodinkee.com',
  urls: [
    'https://shop.hodinkee.com/collections/watches',
    'https://shop.hodinkee.com/collections/watches?page=2',
    'https://shop.hodinkee.com/collections/watches?page=3',
    'https://shop.hodinkee.com/collections/watches?page=4',
    'https://shop.hodinkee.com/collections/watches?page=5',
  ],
  items: 'main.main-content .grid--collection .grid .grid__item .product-container',
  extract: {
    url: 'a.product__pdp-link@href',
    images: [
      '.featured-image@style',
      '.hover-image@style'
    ],
    title: '.h6 .medium-down--hide',
    price: '.product-price',
    sold: {
      selector: '.product__sold-out-badge',
      is: 'Sold'
    }
  }
};
