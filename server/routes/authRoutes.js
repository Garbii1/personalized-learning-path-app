// server/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController'); // We'll create this
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware'); // We'll create this

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, loginUser);

// @route   GET api/auth/profile
// @desc    Get user profile data (requires login)
// @access  Private
router.get('/profile', protect, getUserProfile); // Use protect middleware here

module.exports = router;