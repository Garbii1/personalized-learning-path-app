// server/routes/resourceRoutes.js
const express = require('express');
const { getResources, getResourceById } = require('../controllers/resourceController'); // Create this
const { protect } = require('../middleware/authMiddleware'); // Resources might be public or private

const router = express.Router();

// @route   GET api/resources
// @desc    Get all resources (potentially with filtering/searching)
// @access  Public (or Private if required) - decide based on your app logic
router.get('/', /* protect, */ getResources); // Add protect if login is required to view resources

// @route   GET api/resources/:id
// @desc    Get a single resource by ID
// @access  Public (or Private)
router.get('/:id', /* protect, */ getResourceById);

// --- Add Routes for Creating/Updating/Deleting resources later (maybe admin only) ---
// const { createResource, updateResource, deleteResource } = require('../controllers/resourceController');
// const { admin } = require('../middleware/adminMiddleware'); // Assuming an admin check middleware
// router.post('/', protect, admin, createResource);
// router.put('/:id', protect, admin, updateResource);
// router.delete('/:id', protect, admin, deleteResource);

module.exports = router;