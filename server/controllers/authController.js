// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path
const { validationResult } = require('express-validator'); // Used implicitly by middleware, but good to be aware

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expiration (e.g., 30 days)
    });
};

// Register new user
const registerUser = async (req, res) => {
    // Validation handled by middleware
    const { name, email, password, learningPreferences, currentLevel, goals, timeCommitment, interests } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (password hashing is handled by pre-save hook in model)
        user = new User({
            name,
            email,
            password,
            learningPreferences, // Pass these if provided during signup
            currentLevel,
            goals,
            timeCommitment,
            interests
        });

        await user.save();

        // Return user info and token (exclude password)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            // Include other relevant initial profile data if needed
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).send('Server error during registration');
    }
};

// Login user
const loginUser = async (req, res) => {
    // Validation handled by middleware
    const { email, password } = req.body;

    try {
        // Check for user by email
        const user = await User.findOne({ email });

        // Check user and password
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                // Include other relevant profile data if needed
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).send('Server error during login');
    }
};

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
    // req.user is populated by the 'protect' middleware
    if (req.user) {
        // You can fetch the latest user data again if needed, or just return req.user
         const user = await User.findById(req.user.id).select('-password'); // Ensure fresh data, exclude password
         if (user) {
            res.json(user);
         } else {
             res.status(404).json({ message: 'User not found' });
         }
    } else {
        res.status(401).json({ message: 'Not authorized' }); // Should be caught by middleware, but good backup
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};