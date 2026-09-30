const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController.api');
const { protect } = require('../middleware/authMiddleware.security');
const {
  productValidation,
  productIdValidation,
  validate,
} = require('../utils/inputValidators.utils');

// All product routes are protected
router.use(protect);

// Routes
router
  .route('/')
  .get(getProducts)
  .post(productValidation, validate, createProduct);

router
  .route('/:id')
  .get(productIdValidation, validate, getProduct)
  .put([...productIdValidation, ...productValidation], validate, updateProduct)
  .delete(productIdValidation, validate, deleteProduct);

module.exports = router;
