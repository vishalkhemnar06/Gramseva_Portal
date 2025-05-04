// server/models/Scheme.js
const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema(
    {
        // Village the scheme is relevant to (for filtering)
        villageName: {
            type: String,
            required: [true, 'Village name is required for the scheme'],
            trim: true,
            index: true,
        },
        // Heading/Title of the Government Scheme
        heading: {
            type: String,
            required: [true, 'Scheme heading is required'],
            trim: true,
            maxlength: [200, 'Heading cannot be more than 200 characters'],
        },
        // Detailed information about the scheme
        details: {
            type: String,
            required: [true, 'Scheme details are required'],
        },
        // URL for an image associated with the scheme (optional based on original request, but often useful)
        // Making it optional here for flexibility
        imageUrl: {
            type: String,
            trim: true,
            default: null,
        },
        // Reference to the Sarpanch User who added the scheme information
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the User model
            required: true,
        },
        // Date when the scheme info was added (defaults to creation time)
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

module.exports = mongoose.model('Scheme', SchemeSchema);