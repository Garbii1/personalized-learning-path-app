// server/models/LearningPath.js
const mongoose = require('mongoose');

const LearningPathSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'My Learning Path' },
    description: { type: String },
    goal: { type: String }, // Specific goal for this path
    isActive: { type: Boolean, default: true }, // To mark if this is the user's current path
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

 // Update updatedAt timestamp on modification
 LearningPathSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

module.exports = mongoose.model('LearningPath', LearningPathSchema);