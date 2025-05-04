// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['sarpanch', 'people'],
        required: [true, 'User role is required'],
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    profilePhoto: {
        type: String, // URL to the uploaded photo
        default: 'no-photo.jpg', // Optional: a default placeholder image path/name
    },
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number'],
        unique: true,
        trim: true,
        // Optional: Add validation for format/length if needed
        // match: [/^\d{10}$/, 'Please add a valid 10 digit mobile number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // Automatically prevent password from being returned in queries unless explicitly asked for
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Please specify gender'],
    },
    age: {
        type: Number,
        required: [true, 'Please add age'],
        min: [18, 'Age must be at least 18'], // Example minimum age
    },
    villageName: {
        type: String,
        required: [true, 'Please add village name'],
        trim: true,
    },
    // --- Fields specific to 'people' ---
    aadhaarNo: {
        type: String,
        trim: true,
        // Add length validation later in controller/middleware if needed (12 digits)
        // Required: Will be enforced conditionally in the controller based on role
    },
    // --- Optional fields for 'people' (can be added later via profile update) ---
    dob: {
        type: Date,
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed', null], // Allow null
    },
    occupation: {
        type: String,
        trim: true,
    },
    // --- Timestamps and Status ---
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
    // Optional: Account status (e.g., active, inactive)
    // status: {
    //   type: String,
    //   enum: ['active', 'inactive'],
    //   default: 'active'
    // }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// --- Mongoose Middleware ---

// Encrypt password using bcrypt BEFORE saving a user document
UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (err) {
        next(err); // Pass error to the next middleware/error handler
    }
});

// --- Mongoose Methods ---

// Instance method to compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // 'this.password' refers to the hashed password in the user document
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);