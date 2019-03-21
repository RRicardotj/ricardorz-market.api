const Handler = require('../Handler');
const Product = require('../../models/Product');

class ProductController extends Handler {
  constructor(model = Product, language) {
    super(model, language);

    this.getProductsMain = this.getProductsMain.bind(this);
  }

  getProductsMain() {
    const domain = `"${process.env.SRV_DOMAIN}:${process.env.SRV_PORT}/product_image/"`;
    return this.model.productsForMainScene(domain);
  }
}

module.exports = ProductController;
