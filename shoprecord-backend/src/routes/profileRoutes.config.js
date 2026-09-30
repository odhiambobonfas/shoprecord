const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  deleteProfilePicture,
  upload 
} = require('../controllers/profileController.api');
const { protect } = require('../middleware/authMiddleware.security');

// Profile routes
router.get('/', protect, getProfile);
router.put('/', protect, upload.single('profilePicture'), updateProfile);
router.delete('/picture', protect, deleteProfilePicture);

module.exports = router;
