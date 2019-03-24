const Handler = require('../Handler');
const Category = require('../../models/Category');

class CategoryController extends Handler {
  constructor(model = Category, language) {
    super(model, language);

    this.getAllProductsById = this.getAllProductsById.bind(this);
  }

  getAllProductsById(id, queryPage) {
    try {
      if (!queryPage || Number.isNaN(queryPage)) {
        throw new this.CustomError(this.getMessage(this.LITERALS.PAGE_MUST_BE_A_NUMBER), 403);
      }

      let page = queryPage;
      if (queryPage < 1 || !queryPage) { page = 1; }

      return this.model.getAllProductsById(id, page);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryController;
