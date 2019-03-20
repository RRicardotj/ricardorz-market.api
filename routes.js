const express = require('express');

const router = express.Router();

router.use('/product_image', express.static(`${__dirname}/product_images`));

router.use('/customer', require('./controllers/CustomerController'));
router.use('/department', require('./controllers/DeparmentController'));

router.get('/', (req, res) => {
  res.send('API SERVER UP');
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.handleReject(err);
});

module.exports = router;
