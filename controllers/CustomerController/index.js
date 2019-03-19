const express = require('express');

const router = express.Router();

const withCatchAsync = require('../../common/catchAsyncErrors');

const checkHandler = async (req, res) => {
  res.json({ isValid: true });
};

router.get('/check', withCatchAsync(checkHandler));

module.exports = router;
