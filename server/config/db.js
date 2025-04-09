// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try { // <-- Start of try block
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } 
  catch (err) { // <-- Start of catch block 
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  } // <-- End of catch block
}; // <-- End of function

module.exports = connectDB;