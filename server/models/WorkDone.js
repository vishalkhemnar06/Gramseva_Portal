// server/models/WorkDone.js
const mongoose = require('mongoose');

const WorkDoneSchema = new mongoose.Schema(
    {
        // Village the work was done in
        villageName: {
            type: String,
            required: [true, 'Village name is required for the work record'],
            trim: true,
            index: true,
        },
        // The year the work was completed or primarily undertaken
        year: {
            type: Number,
            required: [true, 'Year is required for the work record'],
            min: [1900, 'Year seems too old'],
            max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
            index: true,
        },
        // Detailed description of the work completed
        details: {
            type: String,
            required: [true, 'Details of the work done are required'],
        },
        // --- ADDED: Optional field for image URLs ---
        // Store as an array to potentially allow multiple images per work record
        imageUrls: [
            {
                type: String,
                trim: true,
            }
        ],
        // Optional: Add fields like cost, funding source, contractor if needed later
        // cost: { type: Number },
        // fundingSource: { type: String },

        // Reference to the Sarpanch User who added this record
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Date when this record was added
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

// Basic validation for year range
WorkDoneSchema.path('year').validate(function(value) {
  const currentYear = new Date().getFullYear();
  return value >= 1900 && value <= currentYear + 1;
}, 'Please enter a valid year.');


module.exports = mongoose.model('WorkDone', WorkDoneSchema);