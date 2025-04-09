// server/server.js
require('dotenv').config(); // Load .env variables early
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // We'll create this next

// Connect to Database
connectDB();

const app = express();

// Init Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Body parser for JSON format

// Simple Route for testing
app.get('/', (req, res) => res.send('API Running'));

// Define Routes (We'll add these later)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/paths', require('./routes/pathRoutes'));

// Basic Error Handling (Optional but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000; // Use environment variable or default

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));