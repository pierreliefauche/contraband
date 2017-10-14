module.exports = {
  id: 'ponti-collection.ch',
  urls: [
    'http://www.ponti-collection.ch/fr/horlogerie?liste=all',
  ],
  items: '.product-preview',
  item: {
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
  }
};
