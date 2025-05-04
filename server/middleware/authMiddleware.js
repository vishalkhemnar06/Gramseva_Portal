// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
require('dotenv').config(); // Ensure JWT_SECRET is accessible

// Custom Error class for more specific error handling (Optional but good practice)
// You could put this in a separate utils/errorResponse.js file
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if Authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Extract token: 'Bearer YOUR_TOKEN_STRING' -> 'YOUR_TOKEN_STRING'
        token = req.headers.authorization.split(' ')[1];
    }
    // Optional: Check for token in cookies if you plan to use them
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // 2. Make sure token exists
    if (!token) {
        // If no token, pass an error to the main error handler
        return next(new ErrorResponse('Not authorized to access this route (No token)', 401));
    }

    try {
        // 3. Verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if secret is configured
        if (!process.env.JWT_SECRET) {
             console.error('FATAL ERROR: JWT_SECRET is not defined in .env file');
             return next(new ErrorResponse('Server configuration error', 500));
        }

        // Check if token payload has the expected user ID property ('id' in our case)
        if (!decoded || !decoded.id) {
            return next(new ErrorResponse('Not authorized to access this route (Invalid token payload)', 401));
        }

        // 4. Get user from DB using ID from token payload, excluding password
        req.user = await User.findById(decoded.id).select('-password');

        // 5. Check if user still exists in the database
        if (!req.user) {
            return next(new ErrorResponse('Not authorized to access this route (User not found)', 401));
        }

        // 6. User is authenticated and found, proceed to the next middleware/route handler
        next();

    } catch (error) {
        // Catch JWT verification errors (invalid signature, expired token etc.)
        console.error('JWT Verification Error:', error.message); // Log the error
        let message = 'Not authorized to access this route (Token failed)';
        if (error.name === 'JsonWebTokenError') {
            message = 'Not authorized to access this route (Invalid token)';
        } else if (error.name === 'TokenExpiredError') {
            message = 'Not authorized to access this route (Token expired)';
        }
        // Pass the error to the main error handler
        return next(new ErrorResponse(message, 401));
    }
});

// Middleware to restrict access based on role(s)
const authorize = (...roles) => {
    return (req, res, next) => {
        // Ensure protect middleware ran successfully and attached req.user
        if (!req.user) {
            // This shouldn't typically happen if protect is always used first, but good safeguard
            return next(new ErrorResponse('Authentication required before checking authorization', 401));
        }

        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            const errorMessage = `User role '${req.user.role}' is not authorized to access this route. Allowed roles: ${roles.join(', ')}`;
            return next(new ErrorResponse(errorMessage, 403)); // 403 Forbidden
        }

        // User has the required role, proceed
        next();
    };
};

module.exports = { protect, authorize, ErrorResponse }; // Export ErrorResponse if defined here