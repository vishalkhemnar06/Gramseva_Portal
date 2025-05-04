// server/controllers/complaintController.js
const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const User = require('../models/User'); // May not be strictly needed if only populating refs
const mongoose = require('mongoose');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (People Only)
const submitComplaint = asyncHandler(async (req, res) => {
    const { subject, details } = req.body;
    const user = req.user; // Logged-in 'people' user from protect/authorize middleware

    if (!subject || !details) {
        res.status(400);
        throw new Error('Complaint subject and details are required.');
    }

    // Create the complaint
    const complaint = await Complaint.create({
        villageName: user.villageName, // Get village from logged-in user
        subject: subject,
        details: details,
        submittedBy: user._id, // Link to the user submitting
        status: 'Pending', // Initial status
        // submittedAt defaults via schema
    });

    if (complaint) {
        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully.',
            complaint: complaint,
        });
    } else {
        res.status(400);
        throw new Error('Invalid complaint data or server error.');
    }
});

// @desc    Get complaints submitted by the logged-in user
// @route   GET /api/complaints/my-complaints
// @access  Private (People Only)
const getMyComplaints = asyncHandler(async (req, res) => {
    const user = req.user; // Logged-in 'people' user

    // --- Pagination ---
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = { submittedBy: user._id }; // Filter by the logged-in user's ID

    const count = await Complaint.countDocuments(keyword);
    const complaints = await Complaint.find(keyword)
        .populate('repliedBy', 'name') // Show Sarpanch name if replied
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ submittedAt: -1 }); // Sort by submission date, newest first

    res.status(200).json({
        success: true,
        count: complaints.length,
        totalCount: count,
        page,
        pages: Math.ceil(count / pageSize),
        complaints: complaints,
    });
});


// @desc    Get all complaints for the Sarpanch's village
// @route   GET /api/complaints/village
// @access  Private (Sarpanch Only)
const getVillageComplaints = asyncHandler(async (req, res) => {
    const sarpanch = req.user; // Logged-in 'sarpanch' user

    // --- Filtering by Status (Optional) ---
    const statusFilter = req.query.status
        ? { status: req.query.status }
        : {};

    // --- Pagination ---
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    // Combine village filter and optional status filter
    const keyword = {
        villageName: sarpanch.villageName,
        ...statusFilter
    };

    const count = await Complaint.countDocuments(keyword);
    const complaints = await Complaint.find(keyword)
        .populate('submittedBy', 'name mobile email') // Show details of the submitter
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ status: 1, submittedAt: -1 }); // Sort by status (Pending first), then newest

    res.status(200).json({
        success: true,
        count: complaints.length,
        totalCount: count,
        page,
        pages: Math.ceil(count / pageSize),
        complaints: complaints,
    });
});


// @desc    Reply to a specific complaint
// @route   PUT /api/complaints/reply/:id
// @access  Private (Sarpanch Only)
const replyToComplaint = asyncHandler(async (req, res) => {
    const complaintId = req.params.id;
    const sarpanch = req.user;
    const { reply } = req.body;

    if (!reply) {
        res.status(400);
        throw new Error('Reply text is required.');
    }

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
        res.status(400);
        throw new Error(`Invalid complaint ID format: ${complaintId}`);
    }

    const complaint = await Complaint.findById(complaintId);

    // *** This check correctly handles the case where ID is wrong or village doesn't match ***
    if (!complaint || complaint.villageName !== sarpanch.villageName) {
        res.status(404);
        throw new Error(`Complaint not found with ID ${complaintId} in village ${sarpanch.villageName}`);
    }

    // Optional: Check if already replied
    // if (complaint.status === 'Replied') { ... }

    // Update the complaint
    complaint.reply = reply;
    complaint.status = 'Replied';
    complaint.repliedBy = sarpanch._id;
    complaint.repliedAt = Date.now();
    complaint.viewedAt = complaint.viewedAt || Date.now();

    const updatedComplaint = await complaint.save();

    // Populate user details for the response
    await updatedComplaint.populate('submittedBy', 'name email');
    await updatedComplaint.populate('repliedBy', 'name');


    res.status(200).json({
        success: true,
        message: 'Reply submitted successfully.',
        complaint: updatedComplaint,
    });
});


// @desc    Mark a complaint as viewed (Optional Implementation)
// @route   PUT /api/complaints/viewed/:id
// @access  Private (Sarpanch Only)
const markComplaintAsViewed = asyncHandler(async (req, res) => {
    const complaintId = req.params.id;
    const sarpanch = req.user;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
        res.status(400);
        throw new Error(`Invalid complaint ID format: ${complaintId}`);
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint || complaint.villageName !== sarpanch.villageName) {
        res.status(404);
        throw new Error(`Complaint not found with ID ${complaintId} in village ${sarpanch.villageName}`);
    }

    if (complaint.status === 'Pending') {
        complaint.status = 'Viewed';
        complaint.viewedAt = Date.now();
        const updatedComplaint = await complaint.save();

        await updatedComplaint.populate('submittedBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Complaint marked as viewed.',
            complaint: updatedComplaint,
        });
    } else {
        await complaint.populate('submittedBy', 'name email');
        if(complaint.repliedBy) { // Only populate repliedBy if it exists
             await complaint.populate('repliedBy', 'name');
        }
        res.status(200).json({
            success: true,
            message: 'Complaint status was already Viewed or Replied.',
            complaint: complaint,
        });
    }
});


module.exports = {
    submitComplaint,
    getMyComplaints,
    getVillageComplaints,
    replyToComplaint,
    markComplaintAsViewed, // Export if using the optional route
};