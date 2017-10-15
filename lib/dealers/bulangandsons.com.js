module.exports = {
  id: 'bulangandsons.com',
  urls: [
    'https://shop.bulangandsons.com/watches.html?product_list_limit=72',
    'https://shop.bulangandsons.com/watches.html?product_list_limit=72&p=2',
    'https://shop.bulangandsons.com/watches.html?product_list_limit=72&p=3',
    'https://shop.bulangandsons.com/watches.html?product_list_limit=72&p=4',
    'https://shop.bulangandsons.com/watches.html?product_list_limit=72&p=5',
  ],
  items: '.product-items li.item.product.product-item',
  extract: {
    url: '.product-item-info a@href',
    images: [
      '.product-item-info img.photo@src',
      '.product-item-info img.hover@src',
    ],
    title: '.product-item-name',
    price: '.price-including-tax .price',
    sold: {
      selector: '.product-item-info.is-sold@class',
      includes: 'is-sold'
    }
  },

  postExtract(item) {
    return item;
  },
};
