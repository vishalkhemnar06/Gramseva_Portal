// server/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Common Configuration ---
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) { return cb(null, true); }
    cb(new Error('Images Only! (jpeg, jpg, png, gif, webp) are allowed.'), false);
};
const commonLimits = { fileSize: 1024 * 1024 * 5 }; // 5MB
const ensureUploadDirExists = (dirPath) => {
    try { if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true }); }
    catch (err) { console.error(`Error creating upload directory ${dirPath}:`, err); }
};

// --- Configuration for Profile Photos ---
const profileUploadDir = path.join(__dirname, '../uploads/profiles');
ensureUploadDirExists(profileUploadDir);
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, profileUploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profilePhoto-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadProfile = multer({ storage: profileStorage, limits: commonLimits, fileFilter: imageFileFilter });
const handleProfileUploadMiddleware = (req, res, next) => { // Renamed export
    uploadProfile.single('profilePhoto')(req, res, function (err) {
        if (err) { /* ... error handling ... */ return next(err); } next();
    });
};

// --- Configuration for Notice Images (Keep if using elsewhere) ---
const noticeUploadDir = path.join(__dirname, '../uploads/notices');
ensureUploadDirExists(noticeUploadDir);
const noticeStorage = multer.diskStorage({ /* ... */ });
const uploadNotice = multer({ storage: noticeStorage, limits: commonLimits, fileFilter: imageFileFilter });
const handleNoticeUploadMiddleware = (req, res, next) => { /* ... */ };

// --- Configuration for Scheme Images (Keep if using elsewhere) ---
const schemeUploadDir = path.join(__dirname, '../uploads/schemes');
ensureUploadDirExists(schemeUploadDir);
const schemeStorage = multer.diskStorage({ /* ... */ });
const uploadScheme = multer({ storage: schemeStorage, limits: commonLimits, fileFilter: imageFileFilter });
const handleSchemeUploadMiddleware = (req, res, next) => { /* ... */ };


// --- *** ADD Configuration for Job Images *** ---
const jobUploadDir = path.join(__dirname, '../uploads/jobs'); // Directory for job images
ensureUploadDirExists(jobUploadDir);

const jobStorage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, jobUploadDir); },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Expect field name 'jobImage' from frontend FormData
        cb(null, 'jobImage-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadJob = multer({
    storage: jobStorage,
    limits: commonLimits,
    fileFilter: imageFileFilter
});

// *** Middleware Handler for Job Images ('jobImage' field) ***
const handleJobUploadMiddleware = (req, res, next) => {
    uploadJob.single('jobImage')(req, res, function (err) { // Use field name 'jobImage'
         if (err) {
            console.error("Job Image Upload Error:", err.code || 'Filter/Unknown', err.message);
            res.status(400);
             let message = (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') ? 'Job Image too large. Max 5MB.' : err.message || 'Job image upload error.';
            return next(new Error(message));
         }
         // Job image is optional, proceed even if no file
          console.log('Job image middleware processed. req.file:', req.file ? req.file.filename : 'No file');
         next(); // Proceed to controller
    });
};

// --- *** ADD Configuration for Work Images *** ---
const workUploadDir = path.join(__dirname, '../uploads/works'); // Directory for work images
ensureUploadDirExists(workUploadDir);

const workStorage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, workUploadDir); },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'workImage-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadWork = multer({
    storage: workStorage,
    limits: commonLimits,
    fileFilter: imageFileFilter
});

// *** Middleware Handler for Work Images (multiple 'workImages' field) ***
const handleWorkImagesUploadMiddleware = (req, res, next) => {
    uploadWork.array('workImages', 5)(req, res, function (err) { // Allow up to 5 images
         if (err) {
            console.error("Work Image Upload Error:", err.code || 'Filter/Unknown', err.message);
            res.status(400);
            let message = (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') 
                ? 'Work Image too large. Max 5MB.' 
                : err.message || 'Work image upload error.';
            return next(new Error(message));
         }
         console.log('Work images middleware processed. req.files:', req.files ? req.files.length : 'No files');
         next(); // Proceed to controller
    });
};


// --- Exports ---
// *** UPDATE Exports to include ALL handlers ***
module.exports = {
    handleProfileUploadMiddleware,
    handleNoticeUploadMiddleware,  // Assuming needed for notices
    handleSchemeUploadMiddleware,  // Assuming needed for schemes
    handleJobUploadMiddleware,     // Add job handler
    handleWorkImagesUploadMiddleware // Add work images handler
};