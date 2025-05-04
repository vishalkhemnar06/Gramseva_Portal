// server/controllers/schemeController.js
const asyncHandler = require('express-async-handler');
const Scheme = require('../models/Scheme');
const User = require('../models/User'); // May not be needed if just using req.user
const mongoose = require('mongoose');

// @desc    Add a new government scheme entry
// @route   POST /api/schemes
// @access  Private (Sarpanch Only)
const addScheme = asyncHandler(async (req, res) => {
    const { heading, details, imageUrl } = req.body;
    const sarpanch = req.user; // Logged-in Sarpanch from middleware

    if (!heading || !details) {
        res.status(400);
        throw new Error('Scheme heading and details are required.');
    }

    // Create the scheme object
    const schemeData = {
        villageName: sarpanch.villageName,
        heading: heading,
        details: details,
        imageUrl: imageUrl || null,
        addedBy: sarpanch._id, // Link to the logged-in Sarpanch
        // addedAt defaults via schema
    };

    // Save the scheme to the database
    const scheme = await Scheme.create(schemeData);

    if (scheme) {
        res.status(201).json({
            success: true,
            message: 'Scheme added successfully',
            scheme: scheme,
        });
    } else {
        res.status(400);
        throw new Error('Invalid scheme data or server error.');
    }
});

// @desc    Get all scheme entries for the logged-in user's village
// @route   GET /api/schemes
// @access  Private (Sarpanch and People)
const getSchemesForVillage = asyncHandler(async (req, res) => {
    const user = req.user; // Could be Sarpanch or People
    const userVillage = user.villageName;

    // --- Pagination ---
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = { villageName: userVillage }; // Filter by the user's village

    const count = await Scheme.countDocuments(keyword);
    const schemes = await Scheme.find(keyword)
        .populate('addedBy', 'name role') // Populate creator's name and role
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ addedAt: -1 }); // Sort by added date, newest first

    res.status(200).json({
        success: true,
        count: schemes.length,
        totalCount: count,
        page,
        pages: Math.ceil(count / pageSize),
        schemes: schemes,
    });
});

// @desc    Delete a scheme entry by ID
// @route   DELETE /api/schemes/:id
// @access  Private (Sarpanch Only)
const deleteScheme = asyncHandler(async (req, res) => {
    const schemeId = req.params.id;
    const sarpanch = req.user; // Logged-in Sarpanch

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
        res.status(400);
        throw new Error(`Invalid scheme ID format: ${schemeId}`);
    }

    // Find the scheme by ID
    const scheme = await Scheme.findById(schemeId);

    // Check if scheme exists
    if (!scheme) {
        res.status(404);
        throw new Error(`Scheme not found with ID: ${schemeId}`);
    }

    // Authorization Check: Ensure the scheme was added by the logged-in Sarpanch
    if (scheme.addedBy.toString() !== sarpanch._id.toString()) {
        res.status(403); // Forbidden
        throw new Error('User not authorized to delete this scheme');
    }

    // Perform deletion
    await scheme.deleteOne();

    res.status(200).json({
        success: true,
        message: `Scheme '${scheme.heading}' deleted successfully`,
        data: {},
    });
});

/* Optional: Get single scheme logic
const getSchemeById = asyncHandler(async (req, res) => {
    // ... implementation similar to getNoticeById or getComplaintById ...
    // Remember to check villageName against req.user.villageName
});
*/

module.exports = {
    addScheme,
    getSchemesForVillage,
    deleteScheme,
    // getSchemeById, // Export if implemented
};