// server/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Village = require('../models/Village');
const { generateToken } = require('../utils/jwtUtils');
const path = require('path'); // Required for handling file paths
const fs = require('fs'); // Required for potential file deletion on error

// --- Helper Function to send token response ---
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') { options.secure = true; }

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(statusCode).json({ success: true, token, user: userResponse });
};

// --- Helper function to delete uploaded file on error ---
const deleteUploadedFileOnError = (filePath) => {
    if (!filePath) return;
    // Construct the full path relative to the project root
    const fullPath = path.join(__dirname, '..', filePath); // Adjust if needed based on where filePath is stored
    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error(`Error deleting uploaded file ${fullPath} on registration failure:`, err);
        } else {
            console.log(`Deleted uploaded file ${fullPath} due to registration failure.`);
        }
    });
};


// @desc    Register a new Sarpanch
// @route   POST /api/auth/register/sarpanch
// @access  Public
const registerSarpanch = asyncHandler(async (req, res, next) => {
    // Data from multipart/form-data body
    const { name, villageName, mobile, email, gender, age, password } = req.body;
    let profilePhotoPath = null; // Variable to store path if file exists

    // *** Check for uploaded file (now mandatory) ***
    if (!req.file) {
        res.status(400);
        throw new Error('Profile photo is required.');
    }
    // *** Get the relative path for storage ***
    profilePhotoPath = path.join('uploads/profiles', req.file.filename).replace(/\\/g, '/'); // Use forward slashes

    // Basic Validation
    if (!name || !villageName || !mobile || !email || !gender || !age || !password) {
         if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath); // Clean up file
        res.status(400);
        throw new Error('Please provide all required fields for Sarpanch registration');
    }

    // *** Age Validation for Sarpanch ***
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 21) {
         if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath); // Clean up file
         res.status(400);
         throw new Error('Sarpanch age must be 21 or older.');
    }

    // Check user exists
    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
         if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath); // Clean up file
        res.status(400);
        throw new Error(`User already exists with this ${userExists.email === email ? 'email' : 'mobile number'}`);
    }

    // Check village exists
    const villageExists = await Village.findOne({ name: villageName.toLowerCase().trim() });
    if (villageExists) {
         if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath); // Clean up file
        res.status(400);
        throw new Error(`Village '${villageName}' is already registered by another Sarpanch`);
    }

    let user; // Declare user variable outside try block
    try {
        // Create Sarpanch User - SAVE THE FILE PATH
        user = await User.create({
            name,
            profilePhoto: profilePhotoPath, // Save the calculated path
            villageName: villageName.trim(),
            mobile,
            email,
            gender,
            age: ageNum,
            password,
            role: 'sarpanch',
        });

        // If user creation succeeded, try creating the village
        if (user) {
             await Village.create({
                name: villageName.toLowerCase().trim(),
                sarpanchId: user._id,
             });
            // If both succeed, send response
            sendTokenResponse(user, 201, res);
        } else {
             // Should not happen if create doesn't throw, but handle defensively
             if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath); // Clean up file
             res.status(400);
             throw new Error('Failed to create user data for Sarpanch');
        }

    } catch (error) {
        // Catch errors during User.create or Village.create
         if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath); // Clean up file
         // If user was potentially created but village failed, delete user
         if (user && user._id) { // Check if user object exists and has ID
             await User.findByIdAndDelete(user._id).catch(delErr => console.error("Error during user rollback:", delErr));
         }
         console.error("Registration Error:", error);
         // Let the default error handler manage the response status/message
         // based on the error type (e.g., validation error)
         next(error); // Pass error to the central error handler
    }
});

// @desc    Register a new People user
// @route   POST /api/auth/register/people
// @access  Public
const registerPeople = asyncHandler(async (req, res, next) => {
    const { name, villageName, mobile, aadhaarNo, email, gender, age, password } = req.body;
     let profilePhotoPath = null;

    // *** Check for uploaded file (mandatory) ***
    if (!req.file) {
        res.status(400);
        throw new Error('Profile photo is required.');
    }
    profilePhotoPath = path.join('uploads/profiles', req.file.filename).replace(/\\/g, '/');

    // Basic Validation
    if (!name || !villageName || !mobile || !aadhaarNo || !email || !gender || !age || !password) {
         if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath);
        res.status(400);
        throw new Error('Please provide all required fields for People registration');
    }

    // Validate Aadhaar
    if (aadhaarNo.toString().trim().length !== 12 || !/^\d+$/.test(aadhaarNo.toString().trim())) {
          if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath);
         res.status(400);
         throw new Error('Aadhaar number must be exactly 12 digits');
    }
     // Age Validation
     const ageNum = Number(age);
     if (isNaN(ageNum) || ageNum < 18) {
          if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath);
         res.status(400);
         throw new Error('Age must be 18 or older.');
     }

    // Check user exists
    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
        if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath);
        res.status(400);
        throw new Error(`User already exists with this ${userExists.email === email ? 'email' : 'mobile number'}`);
    }

    try {
        // Create People User - SAVE THE FILE PATH
        const user = await User.create({
            name,
            profilePhoto: profilePhotoPath, // Save path
            villageName: villageName.trim(),
            mobile,
            aadhaarNo: aadhaarNo.trim(),
            email,
            gender,
            age: ageNum,
            password,
            role: 'people',
        });

        if (user) {
            sendTokenResponse(user, 201, res);
        } else {
            // Should not happen if create doesn't throw
            if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath);
            res.status(400);
            throw new Error('Invalid user data for People');
        }
    } catch (error) {
         // Catch errors during User.create
         if (profilePhotoPath) deleteUploadedFileOnError(profilePhotoPath);
         console.error("Registration Error:", error);
         next(error); // Pass to central error handler
    }
});

// @desc    Authenticate user (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
    // ... (login logic remains the same) ...
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400); throw new Error('Please provide email and password');
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
        res.status(401); throw new Error('Invalid credentials');
    }
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    // req.user is attached by 'protect' middleware
    const user = req.user;
    if (!user) {
        res.status(404);
        // This error case might be handled by protect middleware itself if user deleted after token issued
        throw new Error('User not found (token may be invalid or associated user deleted)');
    }
    res.status(200).json({ success: true, user: user });
});


module.exports = {
    registerSarpanch,
    registerPeople,
    loginUser,
    getMe,
};