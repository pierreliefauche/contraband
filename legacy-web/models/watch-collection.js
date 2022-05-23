import Collection from 'models/_collection';
import WatchModel from 'models/watch';
import config from 'config';

export default Collection.extend({
  url: `${config.apiRoot}/watches`,
  model: WatchModel,
})
