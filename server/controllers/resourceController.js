// server/controllers/resourceController.js
const Resource = require('../models/Resource');

// Get all resources (with optional filtering/searching)
const getResources = async (req, res) => {
    try {
        // Basic filtering examples (expand as needed)
        const query = {};
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.difficulty) {
            query.difficulty = req.query.difficulty;
        }
        if (req.query.tag) {
             // Case-insensitive tag search
            query.topicTags = { $regex: new RegExp(req.query.tag, 'i') };
        }
        if (req.query.search) {
             // Basic text search on title and description (requires text index on schema)
             // Add `ResourceSchema.index({ title: 'text', description: 'text' });` to model
             // query.$text = { $search: req.query.search };
             // Simpler search without text index:
             query.$or = [
                 { title: { $regex: new RegExp(req.query.search, 'i') } },
                 { description: { $regex: new RegExp(req.query.search, 'i') } }
             ];
        }


        const resources = await Resource.find(query); // Apply query filters
        res.json(resources);
    } catch (error) {
        console.error('Get Resources Error:', error.message);
        res.status(500).send('Server Error fetching resources');
    }
};

// Get single resource by ID
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.json(resource);
    } catch (error) {
        console.error('Get Resource By ID Error:', error.message);
         if (error.kind === 'ObjectId') { // Handle invalid MongoDB ID format
             return res.status(400).json({ message: 'Invalid resource ID format' });
         }
        res.status(500).send('Server Error fetching resource');
    }
};

 // --- Placeholder functions for Admin CRUD (implement later if needed) ---
// const createResource = async (req, res) => { /* ... */ };
// const updateResource = async (req, res) => { /* ... */ };
// const deleteResource = async (req, res) => { /* ... */ };

module.exports = {
    getResources,
    getResourceById,
    // createResource,
    // updateResource,
    // deleteResource,
};