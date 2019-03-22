const Handler = require('../Handler');
const Product = require('../../models/Product');

class ProductController extends Handler {
  constructor(model = Product, language) {
    super(model, language);

    this.getProductsMain = this.getProductsMain.bind(this);
  }

  getProductsMain() {
    return this.model.productsForMainScene();
  }
}

module.exports = ProductController;
