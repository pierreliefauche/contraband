module.exports = {
  id: 'vintagecaliber.com',
  urls: [
    'https://vintagecaliber.com/collections/all?page=1',
    'https://vintagecaliber.com/collections/all?page=2',
    'https://vintagecaliber.com/collections/archive?page=1',
    'https://vintagecaliber.com/collections/archive?page=2',
    'https://vintagecaliber.com/collections/archive?page=3',
    'https://vintagecaliber.com/collections/archive?page=4',
  ],
  items: '.main div[itemtype="http://schema.org/ItemList"] div[itemtype="http://schema.org/Product"]',
  extract: {
    url: 'a@href',
    images: [
      '.product_image img@src',
    ],
    title: '.info .title',
    price: '.info .price',
    sold: {
      selector: '.info .sold_out',
      is: 'Sold Out'
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
