// server/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
    {
        // Village the job posting is relevant to (for filtering)
        villageName: {
            type: String,
            required: [true, 'Village name is required for the job posting'],
            trim: true,
            index: true,
        },
        // Heading/Title of the Job Posting
        heading: {
            type: String,
            required: [true, 'Job posting heading is required'],
            trim: true,
            maxlength: [200, 'Heading cannot be more than 200 characters'],
        },
        // Detailed information about the job (description, requirements, contact, etc.)
        details: {
            type: String,
            required: [true, 'Job posting details are required'],
        },
        // Optional URL for an image associated with the job posting
        imageUrl: {
            type: String,
            trim: true,
            default: null,
        },
        // Reference to the Sarpanch User who added the job posting
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links to the User model
            required: true,
        },
        // Date when the job info was posted (defaults to creation time)
        postedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

module.exports = mongoose.model('Job', JobSchema);