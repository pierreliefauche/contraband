module.exports = {
  id: 'steinermaastricht.nl',
  urls: [
    'https://www.steinermaastricht.nl/catalogue/search/watches',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=2',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=3',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=4',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=5',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=6',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=7',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=8',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=9',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=10',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=11',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=12',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=13',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=14',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=15',
    'https://www.steinermaastricht.nl/catalogue/search/watches?page=16',
  ],
  items: 'main.search ul.results > li',
  extract: {
    url: 'a@href',
    images: [
      'img@src',
    ],
    title: 'h2',
    description: 'h3',
    price: 'h4',
    sold: {
      selector: '.sold span',
      is: 'Sold'
    }
  }
};
