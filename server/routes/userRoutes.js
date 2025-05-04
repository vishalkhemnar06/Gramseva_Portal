// server/routes/userRoutes.js
const express = require('express');
const {
    getPeopleInVillage,
    getPersonById,
    updatePersonDetails, // By Sarpanch
    deletePerson         // By Sarpanch
} = require('../controllers/userController'); // We'll create this controller next

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
// Ensures only logged-in Sarpanchs can access these endpoints
router.use(protect);
router.use(authorize('sarpanch'));

// --- Routes for Sarpanch managing People ---

// @desc    Get all people registered in the Sarpanch's village
// @route   GET /api/users/people
// @access  Private (Sarpanch Only)
router.get('/people', getPeopleInVillage);

// @desc    Get details of a specific person by ID
// @route   GET /api/users/people/:id
// @access  Private (Sarpanch Only)
router.get('/people/:id', getPersonById);

// @desc    Update a person's details (by Sarpanch)
// @route   PUT /api/users/people/:id
// @access  Private (Sarpanch Only)
router.put('/people/:id', updatePersonDetails);

// @desc    Delete a person's record (by Sarpanch)
// @route   DELETE /api/users/people/:id
// @access  Private (Sarpanch Only)
router.delete('/people/:id', deletePerson);


// Note: Routes for users managing their OWN profile will be in a separate file (e.g., profileRoutes.js)

module.exports = router;