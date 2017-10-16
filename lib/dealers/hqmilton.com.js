module.exports = {
  id: 'hqmilton.com',
  urls: [
    'https://www.hqmilton.com/timepieces?page=1',
    'https://www.hqmilton.com/timepieces?page=2',
    'https://www.hqmilton.com/timepieces?page=3',
    'https://www.hqmilton.com/timepieces?page=4',
    'https://www.hqmilton.com/timepieces?page=5',
    'https://www.hqmilton.com/timepieces?page=6',
    'https://www.hqmilton.com/timepieces?page=7',
    'https://www.hqmilton.com/timepieces?page=8',
    'https://www.hqmilton.com/timepieces?page=9',
    'https://www.hqmilton.com/timepieces?page=10',
    'https://www.hqmilton.com/timepieces?page=11',
    'https://www.hqmilton.com/timepieces?page=12',
    'https://www.hqmilton.com/timepieces?page=13',
    'https://www.hqmilton.com/timepieces?page=14',
  ],
  items: '.watch-list li.watch',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: '.title',
    price: '.price',
    sold: {
      selector: '.price',
      is: 'Sold',
    },
  },

  postFetch(body) {
    if (body.startsWith('$')) {
      body = body.replace(/^\$\('\.watch-list'\)\.append\("/i, '');
      body = body.replace(/"\);\s*next_page_url.*$/mi, '');
      body = body.replace(/\\(["'])/gi, '$1');
      body = body.replace(/\\n/gi, '\n');
      body = `<body><div class=".watch-list">${body}</div></body>`;
    }

    return body;
  },
};
