// server/controllers/pathController.js
const LearningPath = require('../models/LearningPath');
const PathNode = require('../models/PathNode');
const Resource = require('../models/Resource');
const User = require('../models/User'); // Needed for user preferences

// --- Basic Recommendation Algorithm (Placeholder) ---
// This is highly simplified. Real-world would involve more complex logic,
// potentially machine learning, collaborative filtering, etc.
const findRelevantResources = async (userInterests, userLevel) => {
    // 1. Match interests (tags) - case-insensitive
    // 2. Consider difficulty level (optional, can be refined)
    // 3. Limit the number of resources initially
    const query = {
        topicTags: { $in: userInterests.map(tag => new RegExp(tag, 'i')) } // Match any interest tag
    };

    // Optional: Filter by difficulty (adjust logic as needed)
    // if (userLevel === 'Beginner') {
    //     query.difficulty = { $in: ['Beginner', 'All'] };
    // } else if (userLevel === 'Intermediate') {
    //     query.difficulty = { $in: ['Beginner', 'Intermediate', 'All'] };
    // } // etc.

    // Find resources matching criteria, limit for simplicity
    // Could also add sorting (e.g., by rating if implemented)
    try {
        const resources = await Resource.find(query).limit(10); // Limit to 10 for now
        return resources;
    } catch (error) {
        console.error("Error finding relevant resources:", error);
        return [];
    }
};

// Generate a new learning path
const generateLearningPath = async (req, res) => {
    const userId = req.user.id;
    const { title, description, goal } = req.body; // Allow user to optionally name/describe the path

    try {
        // 1. Get User Preferences
        const user = await User.findById(userId).select('interests currentLevel goals');
        if (!user) return res.status(404).json({ message: 'User not found' });

         // Deactivate previous active paths for this user (optional, depends on logic)
         await LearningPath.updateMany({ userId: userId, isActive: true }, { $set: { isActive: false } });


        // 2. Find Relevant Resources (using the basic algorithm)
        const relevantResources = await findRelevantResources(user.interests, user.currentLevel);

        if (relevantResources.length === 0) {
            return res.status(404).json({ message: 'No relevant resources found for your interests.' });
        }

        // 3. Create the Learning Path entry
        const newPath = new LearningPath({
            userId,
            title: title || `Learning Path for ${user.interests.join(', ')}`,
            description: description || `A path to achieve ${goal || user.goals || 'your learning objectives'}.`,
            goal: goal || user.goals, // Use specific goal if provided, else user's general goal
            isActive: true,
        });
        const savedPath = await newPath.save();

        // 4. Create Path Nodes for each resource in sequence
        const pathNodesPromises = relevantResources.map((resource, index) => {
            const newNode = new PathNode({
                pathId: savedPath._id,
                resourceId: resource._id,
                sequence: index + 1, // Simple linear sequence
                // status defaults to 'Not Started'
            });
            return newNode.save();
        });

        await Promise.all(pathNodesPromises);

        // 5. Respond with the newly created path ID (or the full path object)
        // Fetch the full path with populated nodes to return
        const fullPath = await LearningPath.findById(savedPath._id);
        const nodes = await PathNode.find({ pathId: savedPath._id })
                                   .sort('sequence')
                                   .populate('resourceId', 'title type url difficulty estimatedTimeToComplete'); // Populate resource details

        res.status(201).json({ path: fullPath, nodes });

    } catch (error) {
        console.error('Generate Path Error:', error.message);
        res.status(500).send('Server Error generating learning path');
    }
};

// Get the active learning path for the user
const getActiveLearningPath = async (req, res) => {
    const userId = req.user.id;
    try {
        // Find the active path for the user
        const activePath = await LearningPath.findOne({ userId: userId, isActive: true });

        if (!activePath) {
            return res.status(404).json({ message: 'No active learning path found. Generate one?' });
        }

        // Find associated path nodes, sorted by sequence, and populate resource details
        const pathNodes = await PathNode.find({ pathId: activePath._id })
            .sort('sequence')
            .populate('resourceId', 'title description type url difficulty topicTags estimatedTimeToComplete'); // Select fields you need

        res.json({ path: activePath, nodes: pathNodes });

    } catch (error) {
        console.error('Get Active Path Error:', error.message);
        res.status(500).send('Server Error fetching active learning path');
    }
};

// Update status of a path node
const updatePathNodeStatus = async (req, res) => {
    const { nodeId } = req.params;
    const { completionStatus, notes } = req.body; // Expect status like 'In Progress', 'Completed'
    const userId = req.user.id; // To ensure user owns the path

    try {
        const node = await PathNode.findById(nodeId).populate('pathId'); // Populate path to check ownership

        if (!node) {
            return res.status(404).json({ message: 'Learning path node not found' });
        }

        // Authorization check: Ensure the node belongs to a path owned by the logged-in user
         if (!node.pathId || node.pathId.userId.toString() !== userId) {
             return res.status(403).json({ message: 'User not authorized to update this path node' });
         }


        // Validate completionStatus if provided
        if (completionStatus && !['Not Started', 'In Progress', 'Completed'].includes(completionStatus)) {
            return res.status(400).json({ message: 'Invalid completion status' });
        }

        // Update fields
        if (completionStatus) node.completionStatus = completionStatus;
        if (notes !== undefined) node.notes = notes; // Allow setting/clearing notes

        // Update completion/start dates (simple logic)
        if (completionStatus === 'Completed' && !node.completionDate) {
            node.completionDate = Date.now();
        }
        if (completionStatus === 'In Progress' && !node.startDate) {
            node.startDate = Date.now();
        }
        // Reset dates if going back to 'Not Started' (optional)
        if (completionStatus === 'Not Started') {
            node.startDate = null;
            node.completionDate = null;
        }

        node.updatedAt = Date.now();
        const updatedNode = await node.save();

         // Re-populate resourceId after saving if needed by frontend
        await updatedNode.populate('resourceId', 'title type url');

        res.json(updatedNode);

    } catch (error) {
        console.error('Update Node Status Error:', error.message);
         if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid node ID format' });
         }
        res.status(500).send('Server Error updating path node');
    }
};


module.exports = {
    generateLearningPath,
    getActiveLearningPath,
    updatePathNodeStatus,
};