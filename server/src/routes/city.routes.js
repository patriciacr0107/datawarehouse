const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../controllers/auth.controller');
const {
  getCityById,
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
} = require('../controllers/city.controller');

router.use(protect);

router.route('').get(getAllCities).post(restrictTo('admin'), createCity);

router
  .route('/:id')
  .get(getCityById)
  .patch(restrictTo('admin'), updateCity)
  .delete(restrictTo('admin'), deleteCity);

module.exports = router;
