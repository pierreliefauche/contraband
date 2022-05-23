import Model from 'models/_model';

export default Model.extend({
  props: {
    id: ['string', true],
    name: ['string', false],
    url: ['string', true],
  },
});
