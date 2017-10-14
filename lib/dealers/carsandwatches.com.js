module.exports = {
  id: 'carsandwatches.com',
  urls: [
    'http://www.carsandwatches.com/new-arrivals-2/',
  ],
  items: '#content .post',
  item: {
    url: 'a:nth-child(1)@href',
    images: [
      '.entry-content p a@href',
      '.gallery-item a@href',
    ],
    title: '.entry-title',
    description: '.entry-content > .gallery + p',
    price: '.entry-content > .gallery + p + p',
    // sold: {
    //   selector: '',
    //   is: ''
    // }
  }
};
