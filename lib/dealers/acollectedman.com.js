module.exports = {
  id: 'acollectedman.com',
  urls: [
    'https://www.acollectedman.com/collections/all-watches',
    'https://www.acollectedman.com/collections/all-watches?page=2',
    'https://www.acollectedman.com/collections/all-watches?page=3',
    'https://www.acollectedman.com/collections/all-watches?page=4',
    'https://www.acollectedman.com/collections/all-watches?page=5',
    'https://www.acollectedman.com/collections/all-watches?page=6',
    'https://www.acollectedman.com/collections/all-watches?page=7',
    'https://www.acollectedman.com/collections/all-watches?page=8',
    'https://www.acollectedman.com/collections/all-watches?page=9',
    'https://www.acollectedman.com/collections/all-watches?page=10',
    'https://www.acollectedman.com/collections/all-watches?page=11',
    'https://www.acollectedman.com/collections/all-watches?page=12',
    'https://www.acollectedman.com/collections/all-watches?page=13',
    'https://www.acollectedman.com/collections/all-watches?page=14',
    'https://www.acollectedman.com/collections/all-watches?page=15',
  ],
  items: '.boost-pfs-filter-products .boost-pfs-filter-product-item',
  extract: {
    url: 'a@href',
    images: [
      'img.boost-pfs-filter-product-item-flip-image@data-src',
      'img.boost-pfs-filter-product-item-main-image@data-src',
    ],
    brand: '.product-card__title .boost-pfs-search-suggestion-product-title-first',
    title: '.product-card__title .boost-pfs-search-suggestion-product-title-first',
    description: '.product-card__title .boost-pfs-search-suggestion-product-title-last',
    price: '.boost-pfs-filter-product-item-regular-price',
    sold: {
      selector: '.product-form__price-text',
      is: 'Sold'
    }
  }
};
