module.exports = {
  id: 'hqmilton.com',
  urls: [
    'https://www.hqmilton.com/?',
  ],
  items: '#content .watch-list li.watch',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: '.title',
    price: '.price',
  }
};
