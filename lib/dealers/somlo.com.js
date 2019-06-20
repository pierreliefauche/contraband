module.exports = {
  id: 'somlo.com',
  urls: [
    'https://www.somlo.com/collections/wristwatches',
  ],
  items: '.collection .listing .item.tag-wristwatches:not(.tag-jewellery-watches) .watch',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    brand: 'h3 small',
    title: 'h3',
  },
};
