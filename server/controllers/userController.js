// server/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // User model for accessing people data
const mongoose = require('mongoose'); // To validate ObjectIds

// @desc    Get all people registered in the Sarpanch's village (with search)
// @route   GET /api/users/people
// @access  Private (Sarpanch Only - enforced by middleware in routes)
const getPeopleInVillage = asyncHandler(async (req, res) => {
    // req.user is populated by the 'protect' middleware
    const sarpanchVillage = req.user.villageName;

    // --- Basic Search Functionality ---
    // Check if a 'search' query parameter exists in the URL (e.g., /api/users/people?search=John)
    const keyword = req.query.search
        ? {
              // Search by name (case-insensitive) OR mobile number OR aadhaar number
              // Ensures search is within the Sarpanch's village and only for 'people' role
              $and: [
                  { villageName: sarpanchVillage },
                  { role: 'people' },
                  {
                      $or: [
                          { name: { $regex: req.query.search, $options: 'i' } }, // 'i' for case-insensitive
                          { mobile: { $regex: req.query.search, $options: 'i' } },
                          { aadhaarNo: { $regex: req.query.search, $options: 'i' } },
                      ],
                  },
              ],
          }
        : {
              // If no search keyword, just get all people in the village
              villageName: sarpanchVillage,
              role: 'people',
          };

    // --- Pagination (Optional but Recommended for large lists) ---
    const pageSize = 10; // Number of items per page
    const page = Number(req.query.page) || 1; // Get page number from query, default to 1

    const count = await User.countDocuments(keyword); // Get total count matching the keyword/filter
    const people = await User.find(keyword)
        .select('-password') // Exclude password
        .limit(pageSize)
        .skip(pageSize * (page - 1)) // Calculate how many documents to skip
        .sort({ registeredAt: -1 }); // Sort by registration date, newest first

    res.status(200).json({
        success: true,
        count: people.length, // Count for the current page
        totalCount: count, // Total count matching filter
        page,
        pages: Math.ceil(count / pageSize), // Total number of pages
        people,
    });
});

// @desc    Get details of a specific person by ID
// @route   GET /api/users/people/:id
// @access  Private (Sarpanch Only)
const getPersonById = asyncHandler(async (req, res) => {
    const personId = req.params.id;
    const sarpanchVillage = req.user.villageName;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(personId)) {
        res.status(400); // Bad Request
        throw new Error(`Invalid person ID format: ${personId}`);
    }

    const person = await User.findById(personId).select('-password');

    // Check if person exists AND belongs to the Sarpanch's village AND has role 'people'
    if (!person || person.villageName !== sarpanchVillage || person.role !== 'people') {
        res.status(404); // Not Found
        throw new Error(`Person not found with ID ${personId} in village ${sarpanchVillage}`);
    }

    res.status(200).json({
        success: true,
        person,
    });
});

// @desc    Update a person's details (by Sarpanch)
// @route   PUT /api/users/people/:id
// @access  Private (Sarpanch Only)
const updatePersonDetails = asyncHandler(async (req, res) => {
    const personId = req.params.id;
    const sarpanchVillage = req.user.villageName;
    const { name, mobile, email, gender, age, aadhaarNo, dob, maritalStatus, occupation /* Add other fields as needed */ } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(personId)) {
        res.status(400);
        throw new Error(`Invalid person ID format: ${personId}`);
    }

    // Find the person
    const person = await User.findById(personId);

    // Check if person exists, belongs to the village, and has the correct role
    if (!person || person.villageName !== sarpanchVillage || person.role !== 'people') {
        res.status(404);
        throw new Error(`Person not found with ID ${personId} in village ${sarpanchVillage} or invalid role`);
    }

    // --- Optional: Prevent updating sensitive fields like email/mobile if needed ---
    // if (email && email !== person.email) {
    //     // Check if the new email is already taken by another user
    //     const emailExists = await User.findOne({ email: email, _id: { $ne: personId } });
    //     if (emailExists) {
    //         res.status(400);
    //         throw new Error(`Email ${email} is already registered to another user.`);
    //     }
    //     person.email = email;
    // }
    // Similar check for mobile number if updates are allowed

    // Update fields if they are provided in the request body
    person.name = name ?? person.name;
    person.mobile = mobile ?? person.mobile; // Be careful allowing mobile updates - check uniqueness if needed
    person.email = email ?? person.email;   // Be careful allowing email updates - check uniqueness if needed
    person.gender = gender ?? person.gender;
    person.age = age ?? person.age;
    person.aadhaarNo = aadhaarNo ?? person.aadhaarNo; // Validate length if updated
    person.dob = dob ?? person.dob;
    person.maritalStatus = maritalStatus ?? person.maritalStatus;
    person.occupation = occupation ?? person.occupation;
    // Update profilePhoto if implementing file uploads later

    // Validate Aadhaar if it's being updated
    if (req.body.aadhaarNo && (req.body.aadhaarNo.toString().trim().length !== 12 || !/^\d+$/.test(req.body.aadhaarNo.toString().trim()))) {
        res.status(400);
        throw new Error('Aadhaar number must be exactly 12 digits');
   }

    const updatedPerson = await person.save(); // Run validators on save

    // Exclude password from the response
    const responsePerson = { ...updatedPerson.toObject() };
    delete responsePerson.password;


    res.status(200).json({
        success: true,
        message: 'Person details updated successfully',
        person: responsePerson,
    });
});

// @desc    Delete a person's record (by Sarpanch)
// @route   DELETE /api/users/people/:id
// @access  Private (Sarpanch Only)
const deletePerson = asyncHandler(async (req, res) => {
    const personId = req.params.id;
    const sarpanchVillage = req.user.villageName;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(personId)) {
        res.status(400);
        throw new Error(`Invalid person ID format: ${personId}`);
    }

    const person = await User.findById(personId);

    // Check if person exists, belongs to the village, and is 'people'
    if (!person || person.villageName !== sarpanchVillage || person.role !== 'people') {
        res.status(404);
        throw new Error(`Person not found with ID ${personId} in village ${sarpanchVillage} or invalid role`);
    }

    // Perform the deletion
    await person.deleteOne(); // Use deleteOne() on the document instance

    res.status(200).json({
        success: true,
        message: `Person '${person.name}' deleted successfully`,
        data: {} // Often good practice to return an empty object on successful DELETE
    });
});


module.exports = {
    getPeopleInVillage,
    getPersonById,
    updatePersonDetails,
    deletePerson,
};