// server/controllers/userController.js
const User = require('../models/User');

// Update user profile
const updateUserProfile = async (req, res) => {
    // Validation handled by middleware
    try {
        const user = await User.findById(req.user.id); // Get user from token via protect middleware

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields provided in the request body
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email; // Consider email uniqueness check if allowing change
        if(req.body.password) {
            // If password is being updated, it will be hashed by the pre-save hook
            user.password = req.body.password;
        }
        user.learningPreferences = req.body.learningPreferences || user.learningPreferences;
        user.currentLevel = req.body.currentLevel || user.currentLevel;
        user.goals = req.body.goals || user.goals;
        user.timeCommitment = req.body.timeCommitment || user.timeCommitment;
        user.interests = req.body.interests || user.interests;
        user.updatedAt = Date.now(); // Manually update timestamp

        const updatedUser = await user.save(); // save() triggers pre-save hooks (like password hashing)

        // Return updated user info (exclude password) and potentially a new token if needed (usually not for profile update)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            learningPreferences: updatedUser.learningPreferences,
            currentLevel: updatedUser.currentLevel,
            goals: updatedUser.goals,
            timeCommitment: updatedUser.timeCommitment,
            interests: updatedUser.interests,
            // No need to return token again unless specifically required
        });

    } catch (error) {
        console.error('Profile Update Error:', error.message);
         // Handle potential duplicate email error if email is changed
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        res.status(500).send('Server error during profile update');
    }
};

module.exports = {
    updateUserProfile,
};