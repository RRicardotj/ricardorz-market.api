const express = require('express');

const router = express.Router();

const withCatchAsync = require('../../common/catchAsyncErrors');

const ProductController = require('./ProductController');

const getForMain = async (req, res) => {
  const productController = new ProductController();

  const products = await productController.getProductsMain();

  return res.json(products);
};

router.get('/main', withCatchAsync(getForMain));

module.exports = router;
