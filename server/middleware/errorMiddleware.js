// server/middleware/errorMiddleware.js
const mongoose = require('mongoose'); // Needed to check for specific Mongoose errors

const errorHandler = (err, req, res, next) => {
    // Log the error for the developer
    console.error('-------------------- ERROR --------------------');
    // Log the full error stack in development, simpler message in production
    if (process.env.NODE_ENV !== 'production') {
        console.error(err); // Log the full error object including stack
    } else {
        console.error(`${err.name || 'Error'}: ${err.message}`); // Log basic info
    }
    console.error('---------------------------------------------');


    // Default error status code and message
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // --- Handle Specific Mongoose Errors ---

    // Mongoose Bad ObjectId (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = `Resource not found. Invalid ID format used: ${err.value}`;
        statusCode = 404;
    }

    // Mongoose Duplicate Key Error (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        message = `Duplicate field value entered: '${value}' for field '${field}'. Please use another value.`;
        statusCode = 400;
    }

    // Mongoose Validation Error (ValidationError)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        message = `Invalid input data: ${messages.join('. ')}`;
        statusCode = 400;
    }

    // --- Handle Custom Errors (if you throw errors with a specific status code) ---
    if (err.statusCode) {
         statusCode = err.statusCode;
         message = err.message; // Use the message from the custom error
    }


    // Send the JSON response
    res.status(statusCode).json({
        success: false,
        error: message,
        // Optionally include stack trace in development environment only
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;