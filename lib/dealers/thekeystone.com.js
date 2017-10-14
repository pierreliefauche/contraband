module.exports = {
  id: 'thekeystone.com',
  urls: [
    'https://thekeystone.com/collections/mens-watches',
  ],
  items: '.collection-listing .product-list .product-block',
  item: {
    url: '.product-detail .title a@href',
    images: [
      '.thumbnails a@href',
    ],
    title: '.product-detail .title a',
    price: '.product-detail .price',
    sold: {
      selector: '.product-detail .soldout',
      is: 'Sold'
    }
  }
};
