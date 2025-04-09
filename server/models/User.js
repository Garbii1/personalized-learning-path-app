// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    learningPreferences: {
        visual: { type: Boolean, default: false },
        audio: { type: Boolean, default: false },
        reading: { type: Boolean, default: false },
        practical: { type: Boolean, default: false },
    },
    currentLevel: { type: String, default: 'Beginner' }, // e.g., Beginner, Intermediate, Advanced
    goals: { type: String, default: '' },
    timeCommitment: { type: Number, default: 5 }, // e.g., hours per week
    interests: [{ type: String }], // Array of topic strings/tags
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords (add this to the schema)
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Update updatedAt timestamp on modification
 UserSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});


module.exports = mongoose.model('User', UserSchema);