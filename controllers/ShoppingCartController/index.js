const express = require('express');

const router = express.Router();

const withCatchAsync = require('../../common/catchAsyncErrors');
const validateCart = require('../../middlewares/validateCart');
const ShoppingCartController = require('./ShoppingCartController');

const updateShoppigCartItem = async (req, res) => {
  try {
    const shoppingCartController = new ShoppingCartController(undefined, req.customerLanguage);

    const { quantity, size, color } = req.body;

    const response = await shoppingCartController
      .updateItem(req.params.id, { quantity, size, color });

    return res.json(response);
  } catch (error) {
    throw error;
  }
};

router.put('/:id(\\d+)', validateCart(), withCatchAsync(updateShoppigCartItem));

module.exports = router;
