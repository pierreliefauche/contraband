const log = global.log;
const crypto = require('crypto');
const cheerio = require('cheerio');
const request = require('request');
const async = require('async');
const brands = require('../brands');

class Scraper {
  constructor(config) {
    this.dealer = config;
  }

  parseInt(str) {
    str = str.replace(/ |([.,]\d{0,2}$)/g, '').replace(/['.,]/g, '');
    const int = parseInt(str, 10);
    return isNaN(int) ? null : int;
  }

  fetchBody(url, cb) {
    request({
      url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38',
        'Host': url.split('/')[2],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-us',
      },
      gzip: true,
      agentOptions: {
        rejectUnauthorized: false,
      }
    }, (err, res, body) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      if (res.statusCode !== 200) {
        log.error(`Invalid status fetching dealer id=${this.dealer.id} url=${url}`);
        return cb({ code: 500, message: `Error fetching dealer id=${this.dealer.id}` });
      }

      if (typeof this.dealer.postFetch === 'function') {
        body = this.dealer.postFetch(body);
      }

      return cb(null, body);
    });
  }


  extractPathsValues($, context, paths) {
    paths = [].concat(paths);

    return paths.reduce((allValues, path) => {
      const [ selector, attribute ] = path.split('@');

      const $selected = selector ? $(selector, context) : $(context);

      const values = $selected.map((i, elem) => {
        return attribute ? $(elem).attr(attribute) : $(elem).text();
      }).get().filter(v => v).map(v => v.trim());

      return allValues.concat(values || []);
    }, []);
  }

  extractPathsValue($, context, paths) {
    return this.extractPathsValues($, context, paths).shift();
  }

  extractFromContext($, context) {
    const self = this;
    return {
      value(paths) { return self.extractPathsValue($, context, paths) },
      values(paths) { return self.extractPathsValues($, context, paths) },
    };
  }

  extract(body) {
    const $ = cheerio.load(body);
    const $items = $(this.dealer.items);

    if ($items.length === 0) {
      log.error(`Extracted no items dealer=${this.dealer.id}`);
      return [];
    }

    const specs = this.dealer.extract;

    return $items.map((i, elem) => {
      const get = this.extractFromContext($, elem);

      let item = {
        url: specs.url && get.value(specs.url) || undefined,
        brand: specs.brand && get.value(specs.brand) || undefined,
        title: specs.title && get.value(specs.title) || undefined,
        description: specs.description && get.value(specs.description) || undefined,
        images: Array.isArray(specs.images) && get.values(specs.images) || undefined,
        price: specs.price && get.value(specs.price) || undefined,
        sold: false,
      };

      if (specs.sold && specs.sold.selector) {
        if ('is' in specs.sold) {
          item.sold = get.value(specs.sold.selector) === specs.sold.is;
        }
        if ('includes' in specs.sold) {
          item.sold = (get.value(specs.sold.selector) || '').includes(specs.sold.includes);
        }
      }

      if (typeof this.dealer.postExtract === 'function') {
        item = this.dealer.postExtract(item);
      }

      return item;
    }).get().filter(i => i);
  }


  cleanText(text) {
    text = text.trim().replace(/\s+/gi, ' ');

    if (text === text.toUpperCase()) {
      // Text is in UPPER CASE
      text = text.toLowerCase().replace(/(\b)(.)/gi, (match, pre, char) => `${pre}${char.toUpperCase()}`);
    }

    return text;
  }

  cleanUrl(baseUrl, url) {
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    if (!url.startsWith('http')) {
      return baseUrl + (url.startsWith('/') ? '' : '/') + url;
    }
    return url;
  }

  cleanCurrency(str) {
    str = str.toLowerCase();

    if (str.includes('eur') || str.includes('€')) {
      return 'EUR';
    }

    if (str.includes('gbp') || str.includes('gb£') || str.includes('£')) {
      return 'GBP';
    }

    if (str.includes('chf')) {
      return 'CHF';
    }

    return 'USD';
  }

  cleanPrice(price) {
    const m = price && price.match(/(\d{1,3}['., ]?)*\d{1,3}([.,]\d{1,2})?/);
    if (m && m[0] && this.parseInt(m[0])) {
      return {
        amount: this.parseInt(m[0]),
        currency: this.cleanCurrency(price),
      };
    }
  }

  clean(items) {
    const baseUrl = this.dealer.urls[0].split('/').slice(0, 3).join('/');
    const cleanUrl = this.cleanUrl.bind(this, baseUrl);

    return items.map(item => {
      // Texts: Remove extra white-space
      ['brand', 'title', 'description', 'price'].forEach(key => {
        if (typeof item[key] === 'string') {
          item[key] = this.cleanText(item[key]);
        }
      });

      // Images: handle CSS background images
      if (Array.isArray(item.images)) {
        item.images = item.images.map(imageUrl => {
          const m = imageUrl.match(/url\('?(.*)'?\)/i);
          return (m && m[1]) || imageUrl;
        });
      }
      
      // Images: handle srcset
      if (Array.isArray(item.images)) {
        item.images = item.images.map(imageUrl => {
          return imageUrl.split(',').map(one => one.trim().split(' ')[0]
        }).flat();
      }

      // URLs: Add baseUrl and protocol
      if (item.url) {
        item.url = cleanUrl(item.url);
      }
      if (Array.isArray(item.images)) {
        item.images = item.images.map(cleanUrl);
      }

      // Images: Remove duplicates
      if (Array.isArray(item.images)) {
        item.images = item.images.reduce((images, image) => {
          if (!images.includes(image)) {
            images.push(image);
          }
          return images;
        }, []);
      }

      // Title: add brand name if not already there
      if (item.brand && item.title && !item.title.toLowerCase().includes(item.brand.toLowerCase())) {
        item.title = `${item.brand} ${item.title}`;
      }

      // Price: parse amount and currency
      item.price = this.cleanPrice(item.price);


      if (typeof this.dealer.postClean === 'function') {
        item = this.dealer.postClean(item);
      }

      return item;
    }).filter(i => i);
  }


  filter(items) {
    return items.map(item => {
      if (!item.url) {
        log.warn(`item has no url dealerId=${this.dealer.id}`, item);
        return null;
      }

      if (!item.title) {
        log.warn(`item has no title dealerId=${this.dealer.id}`, item);
        return null;
      }

      if (!(Array.isArray(item.images) && item.images.length > 0)) {
        log.warn(`item has no image dealerId=${this.dealer.id}`, item);
        return null;
      }

      return item;
    }).filter(i => i);
  }


  format(items) {
    return items.map(item => {
      // Generate item ID based on its URL
      item.id = crypto.createHash('md5').update(item.url).digest('base64');

      // Set Dealer ID
      item.dealerId = this.dealer.id;

      // Try to find brand
      item.brandId = (item.brand && brands.extractBrandId(item.brand)) || brands.extractBrandId(item.title) || (item.description && brands.extractBrandId(item.description));

      // Remove brand
      delete item.brand;

      if (typeof this.dealer.postHydrate === 'function') {
        item = this.dealer.postHydrate(item);
      }

      return item;

    }).filter(i => i);
  }


  scrapUrl(url, cb) {
    this.fetchBody(url, (err, body) => {
      if (err) {
        log.error(err);
        return cb(err);
      }

      let items = this.extract(body);
      items = this.clean(items);
      items = this.filter(items);
      items = this.format(items);

      return cb(null, items);
    });
  }


  scrap(cb) {
    let allItems = [];

    async.eachLimit(this.dealer.urls, 3, (url, cb) => {
      this.scrapUrl(url, (err, items) => {
        if (err) {
          log.error(err);
          return cb(err);
        }

        items.forEach(item => {
          if (!allItems.some(i => i.id === item.id)) {
            allItems.push(item);
          }
        });

        return cb(null, items.length > 0);
      });
    }, (err) => {
      return cb(err, allItems);
    });
  }
}

module.exports = Scraper;
