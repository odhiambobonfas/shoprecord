const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
} = require('../controllers/authController.api');
const { protect } = require('../middleware/authMiddleware.security');
const {
  registerValidation,
  loginValidation,
  validate,
} = require('../utils/inputValidators.utils');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
