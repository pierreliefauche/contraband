module.exports = {
  id: '10pastten.com',
  urls: [
    'http://10pastten.com/more-watches?page=1&pageHorilogical=NaN&viewType=grid',
    'http://10pastten.com/more-watches?page=2&pageHorilogical=NaN&viewType=grid',
  ],

  items: '.watch-grid-items .watch-grid-item',

  extract: {
    url: '@data-id',
    images: [
      'img@src',
      '.watch-grid-item-bg@style'
    ],
    title: '.watch-item-title',
    description: '.watch-item-reference',
    price: '.watch-item-status',
    sold: {
      selector: '.watch-item-status',
      is: 'Hold'
    }
  },

  postExtract(item) {
    item.url = `/watch/${item.url}`;
    return item;
  },
};
