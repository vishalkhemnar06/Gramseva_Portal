// server/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure JWT_SECRET is loaded

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId }, // Payload: typically contains user ID
        process.env.JWT_SECRET, // Your secret key from .env
        { expiresIn: '30d' } // Token expiration time (e.g., 30 days)
    );
};

module.exports = { generateToken };