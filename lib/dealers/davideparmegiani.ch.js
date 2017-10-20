module.exports = {
  id: 'davideparmegiani.ch',
  urls: [
    'http://davideparmegiani.ch/watches/page/1/',
    'http://davideparmegiani.ch/watches/page/2/',
    'http://davideparmegiani.ch/watches/page/3/',
    'http://davideparmegiani.ch/watches/page/4/',
    'http://davideparmegiani.ch/watches/page/5/',
    'http://davideparmegiani.ch/watches/page/6/',
    'http://davideparmegiani.ch/watches/page/7/',
    'http://davideparmegiani.ch/watches/page/8/',
    'http://davideparmegiani.ch/watches/page/9/',
    'http://davideparmegiani.ch/watches/page/10/',
    'http://davideparmegiani.ch/sold-watches/page/1/',
    'http://davideparmegiani.ch/sold-watches/page/2/',
    'http://davideparmegiani.ch/sold-watches/page/3/',
    'http://davideparmegiani.ch/sold-watches/page/4/',
    'http://davideparmegiani.ch/sold-watches/page/5/',
  ],
  items: '#watches_list ul li',
  extract: {
    url: 'a.button@href',
    images: [
      '.image img@src',
    ],
    brand: '.info .category',
    title: '.name',
    description: '.abstract > div',
    sold: {
      selector: '.abstract strong',
      is: 'Sold'
    }
  },

  postFetch(body) {
    return body;
  },

  postExtract(item) {
    return item;
  },

  postClean(item) {
    return item;
  },
};
