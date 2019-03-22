const express = require('express');

const router = express.Router();

const withCatchAsync = require('../../common/catchAsyncErrors');

const ProductController = require('./ProductController');

const getForMain = async (req, res) => {
  const productController = new ProductController();

  const products = await productController.getProductsMain();

  return res.json(products);
};

const search = async (req, res) => {
  try {
    const { name, page } = req.query;
    const productController = new ProductController();

    const products = await productController.getProductsByName(name, page);

    return res.json(products);
  } catch (error) {
    throw error;
  }
};

router.get('/main', withCatchAsync(getForMain));

router.get('/', withCatchAsync(search));

module.exports = router;
