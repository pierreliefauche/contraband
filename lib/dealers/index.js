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
  all() {
    return dealers;
  },

  get(dealerId) {
    return dealers[dealerId];
  },
};
