// server/controllers/jobController.js
const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const mongoose = require('mongoose');
const path = require('path'); // <-- Need path
const fs = require('fs');     // <-- Need fs

// Helper to delete file (can be shared in a utils file)
const deleteFile = (filePath) => {
    if (!filePath) return;
    const absolutePath = path.join(__dirname, '..', filePath);
    fs.unlink(absolutePath, (err) => {
        if (err && err.code !== 'ENOENT') console.error(`Error deleting file ${absolutePath}:`, err);
        else if (!err) console.log(`Deleted file ${absolutePath}`);
    });
};

// @desc    Add a new job posting (Handles Optional Image)
// @route   POST /api/jobs
// @access  Private (Sarpanch Only)
const addJob = asyncHandler(async (req, res, next) => {
    console.log("Add Job Controller Start");
    const { heading, details } = req.body; // Parsed by multer
    const sarpanch = req.user;
    let imageUrlPath = null;
    let uploadedFilePathFull = null;

    if (!sarpanch?._id || !sarpanch.villageName) { /* ... auth error ... */ }

    // *** Check req.file from handleJobUploadMiddleware ***
    if (req.file) {
        imageUrlPath = path.join('uploads/jobs', req.file.filename).replace(/\\/g, '/'); // Relative path for DB
        uploadedFilePathFull = path.join(__dirname, '..', imageUrlPath);
        console.log("Job image present, path:", imageUrlPath);
    } else {
        console.log("No job image provided.");
    }

    // Validate text fields
    if (!heading?.trim() || !details?.trim()) {
        if (req.file) deleteFile(imageUrlPath); // Cleanup file if validation fails
        res.status(400); throw new Error('Job posting heading and details are required.');
    }

    try {
        const jobData = {
            villageName: sarpanch.villageName,
            heading: heading.trim(),
            details: details.trim(),
            imageUrl: imageUrlPath, // *** Save path or null ***
            addedBy: sarpanch._id,
        };
        console.log("Attempting Job.create:", jobData);
        const job = await Job.create(jobData);
        console.log("Job created successfully:", job._id);

        res.status(201).json({ success: true, message: 'Job posting added', job: job });

    } catch (error) {
        console.error("!!! ERROR during Job.create:", error);
        if (req.file && uploadedFilePathFull) { deleteFile(imageUrlPath); } // Cleanup file
        next(error); // Pass to central error handler
    }
});

// @desc    Get all job postings for the logged-in user's village
// @route   GET /api/jobs
// @access  Private (Sarpanch and People)
const getJobsForVillage = asyncHandler(async (req, res) => {
    // ... (This function should be correct as previously provided) ...
    const user = req.user; const userVillage = user.villageName;
    const page = Number(req.query.page) || 1; const limit = Number(req.query.limit) || 10;
    const keyword = { villageName: userVillage };
    const count = await Job.countDocuments(keyword);
    const jobs = await Job.find(keyword).populate('addedBy', 'name role').limit(limit).skip(limit * (page - 1)).sort({ postedAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, totalCount: count, page, pages: Math.ceil(count / limit), jobs: jobs });
});

// @desc    Delete a job posting by ID
// @route   DELETE /api/jobs/:id
// @access  Private (Sarpanch Only)
const deleteJob = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id; const sarpanch = req.user;
    if (!mongoose.Types.ObjectId.isValid(jobId)) { res.status(400); throw new Error(`Invalid ID`); }

    // Find job first to get image path
    const job = await Job.findById(jobId);
    if (!job) { res.status(404); throw new Error(`Job posting not found`); }
    if (job.addedBy.toString() !== sarpanch._id.toString()) { res.status(403); throw new Error('Not authorized'); }

    const imagePathToDelete = job.imageUrl; // Get path before deleting DB record

    try {
        await job.deleteOne(); // Delete DB record
        // *** Attempt to delete associated image file ***
        if (imagePathToDelete) {
             deleteFile(imagePathToDelete); // Use helper
        }
        res.status(200).json({ success: true, message: `Job posting deleted`, data: {} });
    } catch(error){
        console.error("Error during job deletion:", error);
        next(error);
    }
});


module.exports = { addJob, getJobsForVillage, deleteJob };