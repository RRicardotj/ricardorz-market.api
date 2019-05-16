const LITERALS = require('../utils/LITERALS');

const Cart = require('../models/Cart');

const validateCart = cartId => async (req, res, next) => {
  const { customerId, customerLanguage } = req;
  const cartIdToValidate = cartId || req.body.cartId || req.params.cartId || req.query.cartId;

  if (!cartIdToValidate) {
    return res.error(LITERALS
      .getMessage(LITERALS.CART_NOT_FOUND, customerLanguage));
  }

  const cart = await Cart.findOne({ where: { cartId: cartIdToValidate }, attributes: ['cartId', 'customerId'] });

  if (!cart) {
    return res.error(LITERALS
      .getMessage(LITERALS.CART_NOT_FOUND, customerLanguage));
  }

  if (!cart.customerId || (cart.customerId && cart.customerId === customerId)) {
    return next();
  }

  return res.error(LITERALS
    .getMessage(LITERALS.CART_BELONGS_OTHER_USER, customerLanguage));
};

module.exports = validateCart;
