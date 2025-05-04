// server/routes/authRoutes.js
const express = require('express');
const {
    registerSarpanch,
    registerPeople,
    loginUser,
    getMe
} = require('../controllers/authController');

// Import necessary middleware
const { protect } = require('../middleware/authMiddleware');
// *** CHANGE THE IMPORTED MIDDLEWARE NAME ***
const { handleProfileUploadMiddleware } = require('../middleware/uploadMiddleware'); // <-- Use the specific profile handler name

// Optional validation middleware (can be added later)
// const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

// @desc    Register a new Sarpanch
// @route   POST /api/auth/register/sarpanch
// @access  Public
// *** CHANGE TO USE THE CORRECT MIDDLEWARE VARIABLE ***
router.post('/register/sarpanch', handleProfileUploadMiddleware, /* validateRegistration('sarpanch'), */ registerSarpanch);

// @desc    Register a new People user
// @route   POST /api/auth/register/people
// @access  Public
// *** CHANGE TO USE THE CORRECT MIDDLEWARE VARIABLE ***
router.post('/register/people', handleProfileUploadMiddleware, /* validateRegistration('people'), */ registerPeople);

// @desc    Authenticate user (Login for both roles)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', /* validateLogin, */ loginUser);

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private (Requires JWT token)
// *** Apply protect middleware ***
router.get('/me', protect, getMe);

module.exports = router;