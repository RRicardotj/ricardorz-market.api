const express = require('express');

const router = express.Router();

const withCatchAsync = require('../../common/catchAsyncErrors');

const DepartmentController = require('./DepartmentController');

const getAllDeparments = async (req, res) => {
  console.log('deparments');
  const departmentController = new DepartmentController();
  const deparments = await departmentController.getAllDeparmentsWithCategories();

  return res.json(deparments);
};

router.get('/', withCatchAsync(getAllDeparments));

module.exports = router;
