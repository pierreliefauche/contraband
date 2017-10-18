const dealerIds = [
  '1025vintage.com',
  '10pastten.com',
  'acollectedman.com',
  'analogshift.com',
  'bulangandsons.com',
  'carsandwatches.com',
  'europeanwatch.com',
  'heuertime.com',
  'hodinkee.com',
  'hqmilton.com',
  'lunaroyster.com',
  'manoftheworld.com',
  'mentawatches.com',
  'metersfirst.com',
  'ponti-collection.ch',
  'somlo.com',
  'ssongwatches.com',
  'thekeystone.com',
  'theoandharris.com',
  'watchsteez.com',
  'worldoftime.de',
];

const dealers = {};
dealerIds.forEach(dealerId => dealers[dealerId] = require(`./${dealerId}`));

module.exports = {
  allById() {
    return dealers;
  },

  all() {
    return dealerIds.map(dealerId => dealers[dealerId]);
  },

  get(dealerId) {
    return dealers[dealerId];
  },
};
