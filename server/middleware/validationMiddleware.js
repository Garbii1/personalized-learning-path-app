// server/middleware/validationMiddleware.js
const { check, validationResult } = require('express-validator');

const validateRegistration = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

 // Add more validators as needed for other routes (e.g., profile update)
 const validateProfileUpdate = [
    check('name').optional().not().isEmpty().withMessage('Name cannot be empty'),
    check('email').optional().isEmail().withMessage('Please include a valid email'),
    // Add checks for learningPreferences, currentLevel, goals, etc.
    check('currentLevel').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid current level'),
    check('timeCommitment').optional().isNumeric().withMessage('Time commitment must be a number'),
    // ... other fields
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];


module.exports = {
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
     // Export other validators here
};