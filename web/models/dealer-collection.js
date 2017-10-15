import Collection from 'models/_collection';
import DealerModel from 'models/dealer';
import config from 'config';

export default Collection.extend({
  url: `${config.apiRoot}/dealers`,
  model: DealerModel,
})
