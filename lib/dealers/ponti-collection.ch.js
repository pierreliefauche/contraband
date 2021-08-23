module.exports = {
  id: 'ponti-collection.ch',
  urls: [
    'https://ponti-collection.ch/en/watches',
  ],
  items: '.product-preview',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: 'h2',
    description: '.prod-description',
    price: '.prod-price',
    sold: {
      selector: '.objet_vendu2',
      is: 'vendu'
    }
  },

  postExtract(item) {
    if (Array.isArray(item.images)) {
      item.images = item.images.map(imageUrl => {
        return imageUrl.replace(/^\/phpThumb\/phpThumb\.php\?src=(.*\.jpg)&.*$/, '$1');
      });
    }

    return item;
  },
};
