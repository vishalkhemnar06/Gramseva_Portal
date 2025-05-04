// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Required for path.join and serving static files
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- Core Middlewares ---

// Enable CORS
app.use(cors());

// Body Parsers
// Need express.json() for JSON bodies (most API requests)
app.use(express.json());
// Need express.urlencoded({ extended: false }) for traditional form submissions (less common for APIs)
app.use(express.urlencoded({ extended: false }));

// --- Serve Static Files ---
// *** ADD THIS MIDDLEWARE TO SERVE UPLOADED FILES ***
// Makes files inside the 'server/uploads' directory accessible via the '/uploads' URL path
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// --- Basic Test Route ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GramSeva Portal API' });
});

// --- API Routes ---
// Mount the main API router AFTER static files and core middleware
app.use('/api', require('./routes/index'));

// --- Error Handling Middleware ---
// Mount the central error handler LAST
app.use(errorHandler);

// Determine the port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
      console.log('HTTP server closed')
      process.exit(0);
    })
})