// server/controllers/workDoneController.js
const asyncHandler = require('express-async-handler');
const WorkDone = require('../models/WorkDone');
const User = require('../models/User');
const mongoose = require('mongoose');
const path = require('path');

// @desc    Add a new record of work done
// @route   POST /api/works
// @access  Private (Sarpanch Only)
const addWorkDone = asyncHandler(async (req, res) => {
    // Destructure data from request body
    const { year, details, imageUrls } = req.body;
    const sarpanch = req.user;

    if (!year || !details) {
        res.status(400);
        throw new Error('Year and details of work done are required.');
    }

    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        res.status(400);
        throw new Error(`Please provide a valid year between 1900 and ${currentYear + 1}.`);
    }

    // Initialize an array for all image URLs (from both uploaded files and provided URLs)
    let allImageUrls = [];

    // Process uploaded files if any
    if (req.files && req.files.length > 0) {
        // Create relative paths for uploaded files
        const uploadedImageUrls = req.files.map(file => {
            // Store the path relative to server root
            return `uploads/works/${file.filename}`;
        });
        
        allImageUrls = [...uploadedImageUrls];
    }

    // Add any imageUrls from the request body if provided
    if (imageUrls) {
        // Handle both array and string input for imageUrls
        const urlsArray = Array.isArray(imageUrls) 
            ? imageUrls 
            : typeof imageUrls === 'string' 
                ? imageUrls.split(/[\n,]+/).map(url => url.trim()).filter(url => url) 
                : [];
                
        allImageUrls = [...allImageUrls, ...urlsArray.filter(url => url)];
    }

    // Create the work record object with all image URLs
    const workData = {
        villageName: sarpanch.villageName,
        year: Number(year),
        details: details,
        imageUrls: allImageUrls,
        addedBy: sarpanch._id,
    };

    // Save the work record to the database
    const workRecord = await WorkDone.create(workData);

    if (workRecord) {
        res.status(201).json({
            success: true,
            message: 'Work record added successfully',
            workRecord: workRecord,
        });
    } else {
        res.status(400);
        throw new Error('Invalid work record data or server error.');
    }
});

// @desc    Get work done records for the logged-in user's village (filter by year)
// @route   GET /api/works
// @access  Private (Sarpanch and People)
const getWorkDoneForVillage = asyncHandler(async (req, res) => {
    const user = req.user;
    const userVillage = user.villageName;

    const yearFilter = req.query.year
        ? { year: Number(req.query.year) }
        : {};

    if (req.query.year && isNaN(Number(req.query.year))) {
        res.status(400);
        throw new Error('Invalid year provided for filtering.');
    }

    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = {
        villageName: userVillage,
        ...yearFilter
    };

    const count = await WorkDone.countDocuments(keyword);
    const workRecords = await WorkDone.find(keyword)
        .populate('addedBy', 'name role')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ year: -1, addedAt: -1 });

    res.status(200).json({
        success: true,
        count: workRecords.length,
        totalCount: count,
        page,
        pages: Math.ceil(count / pageSize),
        workRecords: workRecords,
    });
});

// @desc    Delete a work done record by ID
// @route   DELETE /api/works/:id
// @access  Private (Sarpanch Only)
const deleteWorkDone = asyncHandler(async (req, res) => {
    const workRecordId = req.params.id;
    const sarpanch = req.user;

    if (!mongoose.Types.ObjectId.isValid(workRecordId)) {
        res.status(400);
        throw new Error(`Invalid work record ID format: ${workRecordId}`);
    }

    const workRecord = await WorkDone.findById(workRecordId);

    if (!workRecord) {
        res.status(404);
        throw new Error(`Work record not found with ID: ${workRecordId}`);
    }

    if (workRecord.addedBy.toString() !== sarpanch._id.toString()) {
        res.status(403);
        throw new Error('User not authorized to delete this work record');
    }

    // --- Optional: Delete associated images from storage (Cloudinary/S3) ---
    // If you implement file uploads later, you'll need logic here to
    // iterate through workRecord.imageUrls and delete the actual files
    // from your storage provider before deleting the DB record.
    // Example placeholder:
    // if (workRecord.imageUrls && workRecord.imageUrls.length > 0) {
    //     await deleteImagesFromStorage(workRecord.imageUrls); // Implement this function
    // }

    await workRecord.deleteOne();

    res.status(200).json({
        success: true,
        message: `Work record for year ${workRecord.year} deleted successfully`,
        data: {},
    });
});


module.exports = {
    addWorkDone,
    getWorkDoneForVillage,
    deleteWorkDone,
};