// server/routes/workRoutes.js
const express = require('express');
const {
    addWorkDone,
    getWorkDoneForVillage,
    deleteWorkDone,
} = require('../controllers/workDoneController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { handleWorkImagesUploadMiddleware } = require('../middleware/uploadMiddleware');

const router = express.Router();

// --- Routes for Work Done Records ---

// @desc    Add a new record of work done (with image upload support)
// @route   POST /api/works
// @access  Private (Sarpanch Only)
router.post('/', protect, authorize('sarpanch'), handleWorkImagesUploadMiddleware, addWorkDone);

// @desc    Get all work done records for the logged-in user's village (allow filtering by year)
// @route   GET /api/works
// @access  Private (Sarpanch and People)
router.get('/', protect, getWorkDoneForVillage);

// @desc    Delete a work done record by ID
// @route   DELETE /api/works/:id
// @access  Private (Sarpanch Only)
router.delete('/:id', protect, authorize('sarpanch'), deleteWorkDone);

module.exports = router;