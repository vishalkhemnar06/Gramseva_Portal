// server/models/Notice.js
const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
    {
        // Village the notice belongs to (for easy filtering)
        villageName: {
            type: String,
            required: [true, 'Village name is required for the notice'],
            trim: true,
            index: true, // Add index for faster querying by villageName
        },
        // Heading/Title of the notice
        heading: {
            type: String,
            required: [true, 'Notice heading is required'],
            trim: true,
            maxlength: [150, 'Heading cannot be more than 150 characters'],
        },
        // Detailed content of the notice
        details: {
            type: String,
            required: [true, 'Notice details are required'],
        },
        // Optional URL for an image associated with the notice
        imageUrl: {
            type: String,
            trim: true,
            default: null, // Explicitly set default to null if no image
        },
        // Reference to the Sarpanch User who created the notice
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the User model
            required: true,
        },
        // Date when the notice was published (defaults to creation time)
        publishedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// Optional: Pre-validation or pre-save hooks if needed later
// NoticeSchema.pre('save', function(next) {
//   // Example: Check if createdBy user actually has 'sarpanch' role (might be redundant if routes are protected)
//   // ... logic ...
//   next();
// });

module.exports = mongoose.model('Notice', NoticeSchema);