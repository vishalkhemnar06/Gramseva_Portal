// server/controllers/noticeController.js
const asyncHandler = require('express-async-handler');
const Notice = require('../models/Notice');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Helper to delete file (ensure path is relative like 'uploads/notices/...')
const deleteFile = (filePath) => {
    if (!filePath) return;
    const absolutePath = path.join(__dirname, '..', filePath); // Path relative to controller file
    fs.unlink(absolutePath, (err) => {
        if (err && err.code !== 'ENOENT') { // Ignore 'file not found' errors
             console.error(`Error deleting file ${absolutePath}:`, err);
        } else if (!err) {
            console.log(`Deleted file ${absolutePath}`);
        }
    });
};

// --- ADD NOTICE ---
const addNotice = asyncHandler(async (req, res, next) => {
    console.log("Add Notice Start");
    const { heading, details } = req.body; // From multer
    const sarpanchUser = req.user;
    let imageUrlPath = null;
    let uploadedFilePathFull = null; // Store full path for potential immediate delete

     if (!sarpanchUser?._id || !sarpanchUser.villageName) {
          return next(new Error("Authentication error: User/village details missing."));
     }

    if (req.file) {
        // Relative path for DB
        imageUrlPath = path.join('uploads/notices', req.file.filename).replace(/\\/g, '/');
         // Full path for deletion helper (relative to this file)
        uploadedFilePathFull = path.join(__dirname, '..', imageUrlPath);
        console.log("Notice image present, path:", imageUrlPath);
    }

    if (!heading?.trim() || !details?.trim()) {
        if (req.file) fs.unlink(uploadedFilePathFull, (err) => { if (err) console.error("Error deleting file after validation fail:", err); });
        res.status(400); throw new Error('Notice heading and details are required.');
    }

    try {
        const noticeData = {
            villageName: sarpanchUser.villageName,
            heading: heading.trim(), details: details.trim(),
            imageUrl: imageUrlPath, createdBy: sarpanchUser._id, viewCount: 0
        };
        console.log("Attempting Notice.create:", noticeData);
        const notice = await Notice.create(noticeData);
        console.log("Notice created successfully:", notice._id);
        res.status(201).json({ success: true, message: 'Notice added', notice });
    } catch (error) {
        console.error("!!! ERROR during Notice.create:", error);
        if (req.file && uploadedFilePathFull) { // Check if file was uploaded in this request
             fs.unlink(uploadedFilePathFull, (err) => { if (err) console.error("Error deleting file on DB error:", err); });
        }
        next(error); // Pass to central error handler
    }
});

// --- GET NOTICES FOR VILLAGE ---
const getNoticesForVillage = asyncHandler(async (req, res) => {
    // ... (no changes needed from previous correct version) ...
     const user = req.user; const userVillage = user.villageName;
     const page = Number(req.query.page) || 1; const limit = Number(req.query.limit) || 10;
     const keyword = { villageName: userVillage };
     const count = await Notice.countDocuments(keyword);
     const notices = await Notice.find(keyword).populate('createdBy', 'name role').limit(limit).skip(limit * (page - 1)).sort({ publishedAt: -1 });
     res.status(200).json({ success: true, count: notices.length, totalCount: count, page, pages: Math.ceil(count / limit), notices });
});

// --- DELETE NOTICE ---
const deleteNotice = asyncHandler(async (req, res, next) => {
    const noticeId = req.params.id; const sarpanchUser = req.user;
    if (!mongoose.Types.ObjectId.isValid(noticeId)) { res.status(400); throw new Error(`Invalid ID`); }
    const notice = await Notice.findById(noticeId);
    if (!notice) { res.status(404); throw new Error(`Notice not found`); }
    if (notice.createdBy.toString() !== sarpanchUser._id.toString()) { res.status(403); throw new Error('Not authorized'); }
    const imagePathToDelete = notice.imageUrl; // Get path before deleting record
    try {
        await notice.deleteOne();
        if (imagePathToDelete) { deleteFile(imagePathToDelete); } // Use helper
        res.status(200).json({ success: true, message: `Notice deleted`, data: {} });
    } catch(error){ next(error); }
});

// --- GET NOTICE DETAIL & INCREMENT VIEW ---
const getNoticeByIdAndIncrementView = asyncHandler(async (req, res) => {
    const noticeId = req.params.id; const user = req.user;
    if (!mongoose.Types.ObjectId.isValid(noticeId)) { res.status(400); throw new Error(`Invalid ID`); }
    // Find, increment view count, ensure it's in user's village, return updated
    const notice = await Notice.findOneAndUpdate(
        { _id: noticeId, villageName: user.villageName },
        { $inc: { viewCount: 1 } },
        { new: true }
    ).populate('createdBy', 'name role');
    if (!notice) { res.status(404); throw new Error(`Notice not found or not in your village`); }
    res.status(200).json({ success: true, notice: notice });
});

module.exports = { addNotice, getNoticesForVillage, deleteNotice, getNoticeByIdAndIncrementView };