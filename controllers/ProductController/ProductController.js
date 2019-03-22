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

  getProductsByName(name, queryPage) {
    try {
      if (!queryPage || Number.isNaN(queryPage)) {
        throw new this.CustomError(this.getMessage(this.LITERALS.PAGE_MUST_BE_A_NUMBER), 403);
      }

      let page = queryPage;
      if (queryPage < 1 || !queryPage) { page = 1; }

      return this.model.searchByName(name, page);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductController;
