module.exports = {
  id: 'wannabuyawatch.com',
  urls: [
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/',
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/page/2/',
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/page/3/',
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/page/4/',
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/page/5/',
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/page/6/',
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/page/7/',
    'https://wannabuyawatch.com/product-category/wristwatch/vintage-wristwatch/page/8/',
  ],
  items: 'ul.products li.product',
  extract: {
    uniques: [
      '.sku',
    ],
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
  },

  postFetch(body) {
    return body;
  },

  postExtract(item) {
    return item;
  },

  postClean(item) {
    return item;
  },
};
