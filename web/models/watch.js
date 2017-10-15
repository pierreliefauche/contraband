import Model from 'models/_model';

export default Model.extend({
  props: {
    id: ['string', true],
    url: ['string', true],
    title: ['string', true],
    description: ['string', false],
    images: ['array', true],
    sold: ['boolean', true, false],
    price: ['object', false],
    dealerId: ['string', true],
    brandId: ['string', false],
    createdAt: ['date', true],
    updatedAt: ['date', true],
  },
});
