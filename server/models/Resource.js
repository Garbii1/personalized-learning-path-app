// server/models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['video', 'article', 'course', 'book', 'tutorial', 'other'], // Example types
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All'],
        default: 'All',
    },
    topicTags: [{ type: String }], // For searching and matching interests
    url: { type: String, required: true },
    estimatedTimeToComplete: { type: Number }, // In minutes or hours (be consistent)
    // Optional fields for reviews/ratings later
    // ratings: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }],
    // averageRating: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: Link to admin/user who added it
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

 // Update updatedAt timestamp on modification
 ResourceSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

module.exports = mongoose.model('Resource', ResourceSchema);