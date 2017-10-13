const cheerio = require('cheerio');
const request = require('request');

const dealer = require('../dealers/bulangandsons.com');

const getPathValues = ($, context, paths) => {
  paths = [].concat(paths);

  return paths.reduce((allValues, path) => {
    const [ selector, attribute ] = path.split('@');

    const $selected = selector ? $(selector, context) : $(context);

    const values = $selected.map((i, elem) => {
      return attribute ? $(elem).attr(attribute) : $(elem).text();
    }).get().filter(v => v).map(v => v.trim());

    return allValues.concat(values || []);
  }, []);
};

const getPathValue = ($, context, path) => {
  return getPathValues($, context, path).shift();
};

request({
  url: dealer.urls[0],
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38',
    'Host': dealer.urls[0].split('/')[2],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-us',
  },
  gzip: true,
}, (err, res, body) => {
  if (err) {
    throw err;
  }

  if (res.statusCode !== 200) {
    console.error(body);
    return;
  }

  const $ = cheerio.load(body);
  const $items = $(dealer.items);

  if ($items.length === 0) {
    console.log($.html());
    console.log('Found no items');
    return;
  }

  // console.log(`Found ${$items.length} items`);
// getPathValues($, $items[0], dealer.item.title);return;
  $items.each((i, elem) => {
    let item = {
      brand: dealer.item.brand && getPathValue($, elem, dealer.item.brand),
      title: dealer.item.title && getPathValue($, elem, dealer.item.title),
      url: dealer.item.url && getPathValue($, elem, dealer.item.url),
      images: dealer.item.images && getPathValues($, elem, dealer.item.images),
      description: dealer.item.description && getPathValue($, elem, dealer.item.description),
      price: dealer.item.price && getPathValue($, elem, dealer.item.price),
    };

    if (typeof dealer.postParsing === 'function') {
      item = dealer.postParsing(item);
    }

    console.log(item);

    console.log('\n=====\n');
  });
});
