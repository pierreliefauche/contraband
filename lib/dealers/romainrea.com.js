module.exports = {
  id: 'romainrea.com',
  urls: [
    'http://www.romainrea.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=34&orderby=date_add&orderway=desc&n=150forceSlide',
  ],
  items: '.product_list .product-container',
  extract: {
    url: 'a.product-name@href',
    images: [
      'img@src',
    ],
    title: '.product-name',
    description: '.product-desc',
    sold: {
      selector: '.sale-box',
      is: ''
    }
  },

  postFetch(body) {
    if (typeof body === 'string') {
      try {
        return `<body>${JSON.parse(body).productList}</body>`;
      }
      catch(e) {
        console.error(e);
      }
    }

    return body;
  },

  postExtract(item) {
    return item;
  },

  postClean(item) {
    return item;
  },
};
