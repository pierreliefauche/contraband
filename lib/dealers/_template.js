module.exports = {
  id: '',
  urls: [
    '',
  ],
  items: '',
  extract: {
    url: '',
    images: [
      '',
    ],
    brand: '',
    title: '',
    description: '',
    price: '',
    sold: {
      selector: '',
      is: ''
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
