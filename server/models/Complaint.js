// server/models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
    {
        // Village the complaint pertains to (for filtering by Sarpanch)
        villageName: {
            type: String,
            required: [true, 'Village name is required for the complaint'],
            trim: true,
            index: true, // Index for efficient querying by village
        },
        // Subject/Title of the complaint
        subject: {
            type: String,
            required: [true, 'Complaint subject is required'],
            trim: true,
            maxlength: [200, 'Subject cannot be more than 200 characters'],
        },
        // Detailed description of the complaint
        details: {
            type: String,
            required: [true, 'Complaint details are required'],
        },
        // Status of the complaint
        status: {
            type: String,
            enum: ['Pending', 'Viewed', 'Replied'], // Possible statuses
            default: 'Pending', // Default status when submitted
            index: true, // Index status for potential filtering
        },
        // Reference to the 'People' User who submitted the complaint
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the User model
            required: true,
            index: true, // Index who submitted for fetching 'my-complaints'
        },
        // Timestamp when the complaint was submitted (defaults to creation time)
        // Note: `createdAt` from timestamps:true serves a similar purpose, but this is explicit.
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        // Reply from the Sarpanch
        reply: {
            type: String,
            trim: true,
            default: null, // No reply initially
        },
        // Reference to the 'Sarpanch' User who replied
        repliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the User model
            default: null,
        },
        // Timestamp when the Sarpanch replied
        repliedAt: {
            type: Date,
            default: null,
        },
        // Timestamp when the Sarpanch first viewed the complaint (optional feature)
        viewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// You could add pre-save hooks here if needed, for example, to ensure
// the 'submittedBy' user actually has the role 'people'. However,
// enforcing this in the route/controller might be cleaner.

module.exports = mongoose.model('Complaint', ComplaintSchema);