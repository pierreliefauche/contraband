module.exports = {
  id: 'worldoftime.de',
  urls: [
    'http://www.worldoftime.de/en/newarrivals.html',
    'http://www.worldoftime.de/en/newarrivals/page2.html',
    'http://www.worldoftime.de/en/newarrivals/page3.html',
    'http://www.worldoftime.de/en/newarrivals/page4.html',
    'http://www.worldoftime.de/en/newarrivals/page5.html'
  ],
  items: '.portfolio .items .item',
  item: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    brand: '.info .title',
    title: '.info p nobr',
    description: '.info p',
    price: '.price',
    sold: {
      selector: '.price',
      is: 'sold'
    }
  },

  postParsing(item) {
    if (item.description && item.title && item.description.startsWith(item.title)) {
      item.description = item.description.substr(item.title.length);
    }

    if (item.brand) {
      item.title = [].concat(item.brand || []).concat(item.title || []).join(' ');
    }

    return item;
  },
};
