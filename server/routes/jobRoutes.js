// server/routes/jobRoutes.js
const express = require('express');
const {
    addJob,
    getJobsForVillage,
    deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');
// *** Import the specific middleware for JOB uploads ***
const { handleJobUploadMiddleware } = require('../middleware/uploadMiddleware'); // Ensure this export exists

const router = express.Router();

// --- Routes for Jobs ---

// @desc    Add a new job posting
// @route   POST /api/jobs
// @access  Private (Sarpanch Only)
// *** Apply the JOB upload middleware ***
router.post('/', protect, authorize('sarpanch'), handleJobUploadMiddleware, addJob);

// @desc    Get all job postings for the logged-in user's village
// @route   GET /api/jobs
// @access  Private (Sarpanch and People)
router.get('/', protect, getJobsForVillage); // No upload middleware

// @desc    Delete a job posting by ID
// @route   DELETE /api/jobs/:id
// @access  Private (Sarpanch Only)
router.delete('/:id', protect, authorize('sarpanch'), deleteJob); // No upload middleware

module.exports = router;