const Handler = require('../Handler');
const ShoppingCart = require('../../models/ShoppingCart');
const CartController = require('../CartController/CartController');

class ShoppingCartController extends Handler {
  constructor(model = ShoppingCart, language) {
    super(model, language);
  }


  async updateItem(itemId, { quantity, size, color }) {
    try {
      const item = await this.findOne({ where: { itemId } });

      let { attributes } = item; attributes = JSON.parse(attributes);

      attributes.colorSelected = color || attributes.colorSelected;
      attributes.sizeSelected = size || attributes.sizeSelected;

      attributes = JSON.stringify(attributes);

      await item.update({ attributes, quantity });

      const cartController = new CartController(undefined, this.language);

      const shoppingCart = await cartController.getShoppingCartByCartId(item.cartId);

      return { cartId: item.cartId, shoppingCart };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ShoppingCartController;
