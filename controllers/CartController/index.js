const express = require('express');

const router = express.Router();

const withCatchAsync = require('../../common/catchAsyncErrors');
const CartController = require('./CartController');

const getProductsInCart = async (req, res) => {
  try {
    const language = req.customerLanguage || req.query.language;
    const cartController = new CartController(undefined, language);

    const shoppingCart = await cartController.getCartById(req.params.id, req.customerId);

    return res.json(shoppingCart);
  } catch (error) {
    throw error;
  }
};

const addProductHandler = async (req, res) => {
  try {
    const language = req.customerLanguage || req.query.language;
    const cartController = new CartController(undefined, language);

    const data = {
      customerId: req.customerId,
      cartId: req.body.cartId,
      data: req.body.data,
      productId: req.body.productId,
    };

    const shoppingCart = await cartController.addProduct(data);

    return res.json(shoppingCart);
  } catch (error) {
    throw error;
  }
};

router.get('/:id(\\d+)', withCatchAsync(getProductsInCart));

router.post('/add', withCatchAsync(addProductHandler));

module.exports = router;
