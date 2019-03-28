const express = require('express');

const router = express.Router();

const withCatchAsync = require('../../common/catchAsyncErrors');

const ShippingRegionController = require('./ShippingRegionController');

const indexHandler = async (req, res) => {
  const shippingRigionController = new ShippingRegionController();
  const index = await shippingRigionController.index();
  return res.json(index);
};

router.get('/', withCatchAsync(indexHandler));


module.exports = router;
