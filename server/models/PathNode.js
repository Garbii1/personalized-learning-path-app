// server/models/PathNode.js
const mongoose = require('mongoose');

const PathNodeSchema = new mongoose.Schema({
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    sequence: { type: Number, required: true }, // Order within the path
    completionStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
    notes: { type: String },
    startDate: { type: Date },
    completionDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Ensure unique sequence per path
PathNodeSchema.index({ pathId: 1, sequence: 1 }, { unique: true });

// Update updatedAt timestamp on modification
 PathNodeSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});


module.exports = mongoose.model('PathNode', PathNodeSchema);