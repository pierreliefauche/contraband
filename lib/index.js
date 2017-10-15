global.log = console;

const Scraper = require('./scraper');
const dealers = require('./dealers');

const scraper = new Scraper(dealers.get('analogshift.com'));
scraper.scrap(console.log);








