const Handler = require('../Handler');
const ShippingRegion = require('../../models/ShippingRegion');

class ShippingRegionController extends Handler {
  constructor(model = ShippingRegion, language) {
    super(model, language);

    this.index = this.index.bind(this);
  }

  index() {
    return this.findAll({
      attributes: ['shippingRegionId', 'shippingRegion'],
    });
  }
}

module.exports = ShippingRegionController;
