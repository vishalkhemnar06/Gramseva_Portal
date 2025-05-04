// server/routes/index.js
const express = require('express');
const router = express.Router();

// --- Mount Routers ---

// Mount authentication routes
router.use('/auth', require('./authRoutes'));

// Mount user management routes (for Sarpanch managing people)
router.use('/users', require('./userRoutes')); // Should be present

// Mount notice management routes
router.use('/notices', require('./noticeRoutes')); // Should be present

// Mount complaint management routes
router.use('/complaints', require('./complaintRoutes')); // Should be present

// Mount scheme management routes
router.use('/schemes', require('./schemeRoutes')); // Should be present

// Mount job portal routes
router.use('/jobs', require('./jobRoutes')); // Should be present

// Mount work done routes
router.use('/works', require('./workRoutes')); // Should be present

// Mount profile management routes
router.use('/profile', require('./profileRoutes')); // <-- ADD/UNCOMMENT THIS LINE

// Mount other resource routers here later
// router.use('/uploads', require('./uploadRoutes'));

// Simple route to test if the main router is still working (optional)
// You can keep this or remove it if you prefer
router.get('/', (req, res) => {
    res.send('Main API route endpoint - Use specific paths like /api/auth/, ..., /api/profile/, etc.'); // Updated message slightly
});


module.exports = router;