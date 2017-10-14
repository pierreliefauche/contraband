module.exports = {
  id: 'manoftheworld.com',
  urls: [
    'https://www.manoftheworld.com/collections/timepieces-1?page=1',
    'https://www.manoftheworld.com/collections/timepieces-1?page=2',
  ],
  items: '.products .product-image',
  item: {
    url: 'a.link-wrapper@href',
    images: [
      '.link-wrapper img:not(.alternate)@src',
      '.link-wrapper img.alternate@data-interchange',
    ],
    title: '.vendor',
    description: '.title',
    price: '.price',
  },

  postParsing(item) {
    // Exclude items from the website itself (straps etc)
    if (item.title === 'MAN OF THE WORLD') {
      return null;
    }

    // Combine title and description
    item.title = [].concat(item.title || []).concat(item.description || []).join(' ');
    delete item.description;

    // Clean image urls
    item.images = item.images.map(imageUrl => {
      if (imageUrl.startsWith('[')) {
        return imageUrl.split('[')[2].split(',')[0];
      }
      return imageUrl;
    }).filter(i => i);

    return item;
  },
};
