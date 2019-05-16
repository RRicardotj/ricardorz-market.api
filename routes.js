const express = require('express');

const router = express.Router();

router.use('/product_image', express.static(`${__dirname}/product_images`));

router.use('/banners_image', express.static(`${__dirname}/banners`));

router.use('/cart', require('./controllers/CartController'));
router.use('/category', require('./controllers/CategoryController'));
router.use('/customer', require('./controllers/CustomerController'));
router.use('/department', require('./controllers/DeparmentController'));
router.use('/product', require('./controllers/ProductController'));
router.use('/shipping-region', require('./controllers/ShippingRegionController'));
router.use('/shopping-cart', require('./controllers/ShoppingCartController'));

router.get('/', (req, res) => {
  res.send('API SERVER UP');
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.handleReject(err);
});

module.exports = router;
