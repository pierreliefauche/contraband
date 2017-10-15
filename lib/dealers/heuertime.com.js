module.exports = {
  id: 'heuertime.com',
  urls: [
    'http://www.heuertime.com/index.php?lang=eng&p=sale&sub=sale_products&cat=timepieces',
  ],
  items: '.main .photos',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: 'table tbody',
  }
};
