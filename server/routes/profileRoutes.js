// server/routes/profileRoutes.js
const express = require('express');
const {
    getMyProfile,
    updateMyProfile,
    changeMyPassword // <-- Make sure this is imported if uncommented below
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// --- Routes for Managing Own Profile ---

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// *** UNCOMMENT THE FOLLOWING ROUTE DEFINITION: ***
// @desc    Change the password of the currently logged-in user
// @route   PUT /api/profile/change-password
// @access  Private (Logged-in User Only)
router.put('/change-password', changeMyPassword); // <-- Remove comment markers if present


module.exports = router;