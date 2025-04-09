// server/routes/userRoutes.js
const express = require('express');
const { updateUserProfile } = require('../controllers/userController'); // We'll create this
const { protect } = require('../middleware/authMiddleware');
const { validateProfileUpdate } = require('../middleware/validationMiddleware'); // Import validator

const router = express.Router();

// @route   PUT api/users/profile
// @desc    Update user profile data (requires login)
// @access  Private
router.put('/profile', protect, validateProfileUpdate, updateUserProfile); // Add validator

// Add other user-related routes if needed (e.g., delete account)

module.exports = router;