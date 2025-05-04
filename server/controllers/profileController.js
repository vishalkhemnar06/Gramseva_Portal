// server/controllers/profileController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const mongoose = require('mongoose');

// =============================================
// === FUNCTION DEFINITIONS (should be first) ===
// =============================================

// @desc    Get the profile of the currently logged-in user
// @route   GET /api/profile/me
// @access  Private (Logged-in User Only)
const getMyProfile = asyncHandler(async (req, res) => { // <--- DEFINITION
    const user = req.user;
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({
        success: true,
        user: user,
    });
});

// @desc    Update the profile of the currently logged-in user
// @route   PUT /api/profile/me
// @access  Private (Logged-in User Only)
const updateMyProfile = asyncHandler(async (req, res) => { // <--- DEFINITION
    const userId = req.user._id;
    const {
        name, gender, age, dob, maritalStatus, occupation,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404); throw new Error('User not found');
    }

    // Update allowed fields
    user.name = name ?? user.name;
    user.gender = gender ?? user.gender;
    user.age = age ?? user.age;
    if (user.role === 'people') {
        user.dob = dob ?? user.dob;
        user.maritalStatus = maritalStatus ?? user.maritalStatus;
        user.occupation = occupation ?? user.occupation;
    }

    const updatedUser = await user.save();
    const userResponse = { ...updatedUser.toObject() };
    delete userResponse.password;

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: userResponse,
    });
});

// @desc    Change the password of the currently logged-in user
// @route   PUT /api/profile/change-password
// @access  Private (Logged-in User Only)
const changeMyPassword = asyncHandler(async (req, res) => { // <--- DEFINITION
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
        res.status(400); throw new Error('Please provide current and new password');
    }
    if (newPassword.length < 6) {
        res.status(400); throw new Error('New password must be at least 6 characters long');
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
        res.status(404); throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        res.status(401); throw new Error('Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.'});
});


// ===================================
// === EXPORTS (should be last) ===
// ===================================
module.exports = {
    getMyProfile,      // Now refers to the defined function above
    updateMyProfile,   // Now refers to the defined function above
    changeMyPassword,  // Now refers to the defined function above
};