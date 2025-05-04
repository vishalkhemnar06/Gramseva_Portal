// server/routes/complaintRoutes.js
const express = require('express');
const {
    submitComplaint,
    getMyComplaints,
    getVillageComplaints,
    replyToComplaint,
    markComplaintAsViewed, // Optional
    // getComplaintById // Optional
} = require('../controllers/complaintController'); // We'll create this controller next

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply 'protect' middleware to all complaint routes - must be logged in
router.use(protect);

// --- Routes for People ---

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (People Only)
router.post('/', authorize('people'), submitComplaint);

// @desc    Get complaints submitted by the logged-in user
// @route   GET /api/complaints/my-complaints
// @access  Private (People Only)
router.get('/my-complaints', authorize('people'), getMyComplaints);


// --- Routes for Sarpanch ---

// @desc    Get all complaints for the Sarpanch's village
// @route   GET /api/complaints/village
// @access  Private (Sarpanch Only)
router.get('/village', authorize('sarpanch'), getVillageComplaints);

// @desc    Reply to a specific complaint
// @route   PUT /api/complaints/reply/:id
// @access  Private (Sarpanch Only)
router.put('/reply/:id', authorize('sarpanch'), replyToComplaint);

/* Optional: Route to mark a complaint as viewed by Sarpanch
// @desc    Mark a complaint as viewed
// @route   PUT /api/complaints/viewed/:id
// @access  Private (Sarpanch Only)
router.put('/viewed/:id', authorize('sarpanch'), markComplaintAsViewed);
*/

/* Optional: Route to get a single complaint by ID (could be for either role)
// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private (Sarpanch or People - Controller needs to check ownership/village)
router.get('/:id', getComplaintById);
*/


module.exports = router;