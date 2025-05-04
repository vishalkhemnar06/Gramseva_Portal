// server/models/Village.js
const mongoose = require('mongoose');

const VillageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Village name is required'],
        unique: true, // Ensures village names are unique in this collection
        trim: true,
        lowercase: true // Store village names consistently
    },
    // Link to the Sarpanch user who registered this village
    sarpanchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' model
        required: true,
        unique: true // Ensures only one Sarpanch per village record
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Village', VillageSchema);