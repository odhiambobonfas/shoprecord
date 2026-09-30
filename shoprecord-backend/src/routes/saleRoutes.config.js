const express = require('express');
const router = express.Router();
const {
  createSale,
  getSales,
  getSale,
  getSalesAnalytics,
  updatePaymentStatus,
  deleteSale,
} = require('../controllers/saleController.api');
const { protect } = require('../middleware/authMiddleware.security');

// Protect all routes
router.use(protect);

// Sales routes
router.route('/')
  .get(getSales)
  .post(createSale);

router.get('/analytics/summary', getSalesAnalytics);

router.route('/:id')
  .get(getSale)
  .delete(deleteSale);

router.put('/:id/payment', updatePaymentStatus);

module.exports = router;
