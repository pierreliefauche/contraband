import * as crypto from 'crypto'
import * as cheerio from 'cheerio'
import axios from 'axios'

import type {
  Item,
  ItemExtract,
  DealerConfig,
  DealerProcessor,
} from '../types'

const log = console

interface Config {
  dealer: DealerConfig & DealerProcessor
}

export default class Scraper {
  private dealer: DealerConfig & DealerProcessor

  constructor({ dealer }: Config) {
    this.dealer = dealer
  }

  protected parseInt (str: string): null | number {
    str = str.replace(/ |([.,]\d{0,2}$)/g, '').replace(/['.,]/g, '');
    const int = parseInt(str, 10);
    return isNaN(int) ? null : int;
  }

  protected async fetchBody (url: string): Promise<string> {
    try {
      const { data, status } = await axios.get<string>(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Safari/604.1.38',
          'Host': url.split('/')[2],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-us',
        },
      })

      if (status < 200 || status >= 300) {
        throw new Error(`Error fetching dealer id=${this.dealer.id}`)
      }

      return typeof this.dealer.postFetch === 'function'
          ? this.dealer.postFetch(data)
          : data
    } catch (error) {
      log.error(error)
      throw error
    }
  }


  protected extractPathsValues($: cheerio.CheerioAPI, context: cheerio.Node, _paths: string | string[]): string[] {
    const paths: string[] = Array.isArray(_paths) ? _paths : [_paths]

    return paths.reduce<string[]>((allValues, path) => {
      const [ selector, attribute ] = path.split('@');

      const $selected = selector ? $(selector, context) : $(context);

      const values = $selected
        .map((i, elem) => attribute ? $(elem).attr(attribute) : $(elem).text())
        .get()
        .filter(Boolean)
        .map(v => v.trim());

      return allValues.concat(values || []);
    }, []);
  }

  protected extractPathsValue($: cheerio.CheerioAPI, context: cheerio.Node, paths: string | string[]): string {
    return this.extractPathsValues($, context, paths)[0];
  }

  protected extractFromContext($: cheerio.CheerioAPI, context: cheerio.Node) {
    const self = this;
    return {
      value(paths: string | string[]) { return self.extractPathsValue($, context, paths) },
      values(paths: string | string[]) { return self.extractPathsValues($, context, paths) },
    };
  }

  protected extract(body: string): ItemExtract[] {
    const $ = cheerio.load(body, {scriptingEnabled: !this.dealer.disableScripting});
    const $items = $(this.dealer.extract.items);

    if ($items.length === 0) {
      log.error(`Extracted no items dealer=${this.dealer.id}`);
      return [];
    }

    const specs = this.dealer.extract;

    return $items.map((i, elem) => {
      const get = this.extractFromContext($, elem);
      
      let item: ItemExtract = {
        url: get.value(specs.url),
        brand: specs.brand && get.value(specs.brand) || undefined,
        title: specs.title && get.value(specs.title) || undefined,
        description: specs.description && get.value(specs.description) || undefined,
        images: Array.isArray(specs.images) && get.values(specs.images) || undefined,
        price: {
          raw: specs.price && get.value(specs.price) || undefined
        },
        sold: false,
      };

      if (specs.sold && specs.sold.selector && typeof specs.sold.selector === 'string') {
        if ('is' in specs.sold) {
          item.sold = get.value(specs.sold.selector) === specs.sold.is;
        }
        if ('includes' in specs.sold && typeof specs.sold.includes === 'string') {
          item.sold = (get.value(specs.sold.selector) || '').includes(specs.sold.includes);
        }
      }

      if (typeof this.dealer.postExtract === 'function') {
        item = this.dealer.postExtract(item);
      }

      return item;
    }).get().filter(i => i);
  }


  protected cleanText(text: string): string {
    text = text.trim().replace(/\s+/gi, ' ');

    if (text === text.toUpperCase()) {
      // Text is in UPPER CASE
      text = text.toLowerCase().replace(/(\b)(.)/gi, (match, pre, char) => `${pre}${char.toUpperCase()}`);
    }

    return text;
  }

  protected cleanUrl(baseUrl: string, url: string): string {
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    if (!url.startsWith('http')) {
      return baseUrl + (url.startsWith('/') ? '' : '/') + url;
    }
    return url;
  }

  protected cleanCurrency(str: string): string {
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

  protected cleanPrice(price: Item['price']): Item['price'] | undefined {
    if (price?.raw) {
      const m = price.raw.match(/(\d{1,3}['., ]?)*\d{1,3}([.,]\d{1,2})?/);
      if (m?.[0] && this.parseInt(m[0])) {
        return {
          ...price,
          amount: this.parseInt(m[0]) || undefined,
          currency: this.cleanCurrency(price.raw),
        };
      }
    }
    
  }

  protected clean(items: ItemExtract[]): ItemExtract[] {
    const baseUrl = this.dealer.urls[0].split('/').slice(0, 3).join('/');
    const cleanUrl = this.cleanUrl.bind(this, baseUrl);

    return items.map(item => {
      // Texts: Remove extra white-space
      const keys = ['brand', 'title', 'description'] as const
      keys.forEach(key => {
        const value = item[key]
        if (typeof value === 'string') {
          item[key] = this.cleanText(value);
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
        item.images = item.images.reduce<string[]>((images, imageUrl) => {
          images.push(...imageUrl.split(',').map(one => one.trim().split(' ')[0]))
          return images
        }, []);
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
        item.images = item.images.reduce<string[]>((images, image) => {
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
    }).filter(Boolean);
  }


  protected filter(items: ItemExtract[]): ItemExtract[] {
    return items.map((item) => {
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
    }).filter((item): item is ItemExtract => !!item);
  }


  protected format(items: ItemExtract[]): Item[] {
    return items.map((extract) => {
      let item: Item = {
        ...extract,
        id: crypto.createHash('md5').update(extract.url).digest('base64'),
        dealerId: this.dealer.id
      }

      if (typeof this.dealer.postHydrate === 'function') {
        item = this.dealer.postHydrate(item);
      }

      return item;

    }).filter(Boolean);
  }


  protected async scrapUrl (url: string): Promise<Item[]> {
    const body = await this.fetchBody(url)
    
    let extracts = this.extract(body);
    extracts = this.clean(extracts);
    extracts = this.filter(extracts);
    const items = this.format(extracts);
    
    return items
  }


  public async scrap(): Promise<Item[]> {
    const allItems: Item[] = []

    for (const url of this.dealer.urls) {
      const items = await this.scrapUrl(url)
      items.forEach(item => {
        if (!allItems.some(i => i.id === item.id)) {
          allItems.push(item);
        }
      })
    }

    return allItems
  }
}