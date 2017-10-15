module.exports = {
  id: 'europeanwatch.com',
  urls: [
    'https://www.europeanwatch.com/new.html',
  ],
  items: '#main #content .result-list > li',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: 'img@alt',
    description: '.holder > p',
    price: '.details li:nth-child(2)',
  }
};
