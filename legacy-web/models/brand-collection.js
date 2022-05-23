import Collection from 'models/_collection';
import BrandModel from 'models/brand';
import config from 'config';

export default Collection.extend({
  url: `${config.apiRoot}/brands`,
  model: BrandModel,
})
