// server/routes/pathRoutes.js
const express = require('express');
const {
    generateLearningPath,
    getActiveLearningPath,
    updatePathNodeStatus,
    // getPathById, // Optional: if needed beyond the active one
    // getAllUserPaths, // Optional: view past paths
} = require('../controllers/pathController'); // Create this
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST api/paths/generate
// @desc    Generate a new personalized learning path for the logged-in user
// @access  Private
router.post('/generate', protect, generateLearningPath);

// @route   GET api/paths/active
// @desc    Get the currently active learning path for the logged-in user (with nodes)
// @access  Private
router.get('/active', protect, getActiveLearningPath);

// @route   PUT api/paths/nodes/:nodeId
// @desc    Update the status (or other details) of a specific node in a path
// @access  Private
router.put('/nodes/:nodeId', protect, updatePathNodeStatus);

// --- Optional Routes ---
// router.get('/:pathId', protect, getPathById);
// router.get('/', protect, getAllUserPaths); // Get all paths for the user

module.exports = router;