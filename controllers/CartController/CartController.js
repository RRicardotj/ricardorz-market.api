const Handler = require('../Handler');
const Cart = require('../../models/Cart');

class CartController extends Handler {
  constructor(model = Cart, language) {
    super(model, language);

    this.getCartById = this.getCartById.bind(this);
  }

  getCartById(cartId, customerId) {
    return this.model.findShoppingCart(cartId, customerId); // TODO
  }
}

module.exports = CartController;
