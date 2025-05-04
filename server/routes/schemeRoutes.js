// server/routes/schemeRoutes.js
const express = require('express');
const {
    addScheme,
    getSchemesForVillage,
    deleteScheme,
    // getSchemeById // Optional
} = require('../controllers/schemeController'); // We'll create this controller next

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Routes for Schemes ---

// @desc    Add a new government scheme entry
// @route   POST /api/schemes
// @access  Private (Sarpanch Only)
router.post('/', protect, authorize('sarpanch'), addScheme);

// @desc    Get all scheme entries for the logged-in user's village
// @route   GET /api/schemes
// @access  Private (Sarpanch and People)
// Note: Only 'protect' is needed; filtering happens in the controller.
router.get('/', protect, getSchemesForVillage);

// @desc    Delete a scheme entry by ID
// @route   DELETE /api/schemes/:id
// @access  Private (Sarpanch Only)
// Note: Controller must verify ownership (addedBy).
router.delete('/:id', protect, authorize('sarpanch'), deleteScheme);

/* Optional: Route to get a single scheme by ID
// @desc    Get a single scheme entry by ID
// @route   GET /api/schemes/:id
// @access  Private (Sarpanch and People)
router.get('/:id', protect, getSchemeById);
*/

module.exports = router;