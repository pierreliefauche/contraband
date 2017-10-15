module.exports = {
  id: 'hodinkee.com',
  urls: [
    'https://shop.hodinkee.com/collections/watches',
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
