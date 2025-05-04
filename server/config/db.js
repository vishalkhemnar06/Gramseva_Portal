// server/config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure env variables are loaded

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Options are automatically handled in Mongoose 6+,
      // but you might keep these for older versions or clarity:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;