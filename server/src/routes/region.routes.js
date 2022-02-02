const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../controllers/auth.controller');
const {
  getRegionById,
  getAllRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} = require('../controllers/region.controller');

router.use(protect);

router.route('').get(getAllRegions).post(restrictTo('admin'), createRegion);

router
  .route('/:id')
  .get(getRegionById)
  .patch(restrictTo('admin'), updateRegion)
  .delete(restrictTo('admin'), deleteRegion);

module.exports = router;
