// server/routes/noticeRoutes.js
const express = require('express');
const {
    addNotice,
    getNoticesForVillage,
    deleteNotice,
    // getNoticeById // Optional: If needed later to view a single notice detail page
} = require('../controllers/noticeController'); // We'll create this controller next

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Routes for Notices ---

// @desc    Add a new notice
// @route   POST /api/notices
// @access  Private (Sarpanch Only)
// Note: 'protect' ensures logged in, 'authorize' ensures role is 'sarpanch'
router.post('/', protect, authorize('sarpanch'), addNotice);

// @desc    Get all notices for the logged-in user's village
// @route   GET /api/notices
// @access  Private (Sarpanch and People)
// Note: Only 'protect' is needed here, as both roles need to view notices for their village.
// The controller logic will filter based on the user's village.
router.get('/', protect, getNoticesForVillage);

// @desc    Delete a notice by ID
// @route   DELETE /api/notices/:id
// @access  Private (Sarpanch Only)
// Note: Protects the route and ensures only Sarpanch can attempt deletion.
// The controller MUST verify that the Sarpanch owns the notice before deleting.
router.delete('/:id', protect, authorize('sarpanch'), deleteNotice);

/* Optional: Route to get a single notice by ID if needed later
// @desc    Get a single notice by ID
// @route   GET /api/notices/:id
// @access  Private (Sarpanch and People)
router.get('/:id', protect, getNoticeById);
*/

module.exports = router;