module.exports = {
  id: 'somlo.com',
  urls: [
    'http://www.somlo.com/the-watches-collections/',
  ],
  items: '.collection .listing .item.tag-wristwatches:not(.tag-jewellery-watches) .watch',
  item: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    brand: 'h3 small',
    title: 'h3',
  },
};
