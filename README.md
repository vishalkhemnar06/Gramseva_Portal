# GramSeva Portal (Village & Gram Panchayat Connect Platform)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional License Badge -->

A full-stack web application connecting villagers with their Gram Panchayat (Sarpanch) to facilitate communication, information sharing, complaint management, and transparency.

---


## Features

*General:*
*   Role-based access (Villager/People vs. Sarpanc).
*   Secure JWT-based Authentication (Registration & Login).
*   Responsive design using Tailwind CSS.

*Villager (People) Features:*
*   View Dashboard Overview.
*   View Village Notices posted by Sarpanch.
*   View Government Schemes added by Sarpanch.
*   View Job Opportunities posted by Sarpanch.
*   View Work Done by Gram Panchayat (Year-wise).
*   Submit Complaints to the Sarpanch.
*   View own submitted complaints and replies.
*   Manage own Profile.

*Sarpanch Features:*
*   View Dashboard Overview with key stats.
*   Manage Registered Villagers (View, Search, Update, Delete - Note: Implement Update/Delete API calls if placeholders exist).
*   Manage Notices (Add, View, Delete).
*   Manage Government Schemes (Add, View, Delete).
*   Manage Job Portal (Add, View, Delete).
*   Manage Work Done Records (Add, View Year-wise, Delete).
*   View Complaints submitted by villagers.
*   Reply to Complaints.
*   Manage own Profile.

---

## Screenshots

(Add your screenshots here! Use Markdown image syntax. You can upload images directly to your GitHub repository or use an image hosting service.)

*Example:*

*   *Homepage:*
    ![Homepage Screenshot](screenshots/homepage.png "GramSeva Portal Homepage")

*   *Login Page:*
    ![Login Screenshot](screenshots/login.png "Login Options")

*   *Sarpanch Dashboard:*
    ![Sarpanch Dashboard Screenshot](screenshots/sarpanch_dashboard.png "Sarpanch Dashboard Overview")

*   *View People (Sarpanch):*
    ![View People Screenshot](screenshots/view_people.png "Sarpanch View People List")

*   *Add Notice (Sarpanch):*
    ![Add Notice Screenshot](screenshots/add_notice.png "Add Notice Form")

*   *People Dashboard:*
    ![People Dashboard Screenshot](screenshots/people_dashboard.png "People Dashboard Overview")

*   *(Add more screenshots for different features...)*

(Tip:* Create a screenshots folder in your project root to store the image files and link to them like above.)*

---

## Technology Stack

*   *Frontend:* React.js (with Vite), React Router DOM
*   *Backend:* Node.js, Express.js
*   *Database:* MongoDB (with Mongoose ODM)
*   *Styling:* Tailwind CSS
*   *Authentication:* JSON Web Tokens (JWT), bcryptjs
*   *File Uploads:* Multer (for local storage - Update if using Cloudinary/S3)
*   *API Testing:* Postman (or similar)


---

## Setup and Installation

### Prerequisites

*   Node.js (v16 or later recommended)
*   npm or yarn
*   MongoDB (Local instance or a MongoDB Atlas cluster URI)
*   Git

### Backend Setup

1.  *Clone the repository:*
    bash
    git clone <your-repository-url>
    cd gramseva-portal/server
    
2.  *Install dependencies:*
    bash
    npm install
    # or yarn install
    
3.  *Create Environment File:*
    *   Create a .env file in the server/ directory.
    *   Copy the contents of .env.example (if you create one) or add the required variables (see [Environment Variables](#environment-variables) section below).
    *   **Crucially, set your MONGO_URI and JWT_SECRET.**
4.  *Run the backend server (development mode):*
    bash
    npm run dev
    
    The server should start, typically on port 5001 (or the port specified in your .env).

### Frontend Setup

1.  *Navigate to the client directory:*
    bash
    cd ../client
    # (If you are already in the root, just 'cd client')
    
2.  *Install dependencies:*
    bash
    npm install
    # or yarn install
    
3.  *Create Environment File:*
    *   Create a .env file in the client/ directory.
    *   Add the required variables (see [Environment Variables](#environment-variables) section below).
    *   **Set VITE_API_BASE_URL and VITE_SERVER_BASE_URL** to point to your running backend.
4.  *Run the frontend development server:*
    bash
    npm run dev
    
    The frontend app should open in your browser, typically at http://localhost:5173.

---

## Environment Variables

Create .env files in both the server/ and client/ directories. *Do not commit these files to Git.*

**server/.env:**

```dotenv
# Server Configuration
PORT=5001                 # Port for the backend server
NODE_ENV=development      # set to 'production' in deployment

# Database
MONGO_URI=<your_mongodb_connection_string> # Replace with your actual MongoDB URI

# Security
JWT_SECRET=<your_strong_random_jwt_secret> # Replace with a long, random, secret string
JWT_EXPIRES_IN=30d       # Optional: JWT expiration time (used in jwtUtils if implemented)

# Cloudinary (Optional - if using cloud storage instead of local)
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

client/.env:
# Frontend Configuration (Prefix with VITE_)
VITE_API_BASE_URL=http://localhost:5001/api    # Full URL to the backend API root
VITE_SERVER_BASE_URL=http://localhost:5001      # Base URL of the backend server (for image paths)
Use code with caution.
Dotenv
(Optional: Create .env.example files in both directories showing the variable names needed, but leave the values blank or as placeholders, and commit these example files.)
Running the Application
Start the Backend Server:
cd server
npm run dev
Use code with caution.
Bash
Start the Frontend Server:
Open a new terminal window/tab.
Navigate to the client directory:
cd client
npm run dev
Use code with caution.
Bash
Open your browser and navigate to the frontend URL (usually http://localhost:5173).
(Optional: Use a tool like concurrently to start both servers with one command. Install it: npm install concurrently -g or locally. Then add a script to the root package.json: "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"")
API Endpoints
(Optional: List key API endpoints here, or link to separate API documentation if you create it.)
Example:
POST /api/auth/register/sarpanch - Register Sarpanch
POST /api/auth/register/people - Register People
POST /api/auth/login - Login User
GET /api/profile/me - Get Own Profile
PUT /api/profile/me - Update Own Profile
GET /api/users/people - [Sarpanch] Get people list
DELETE /api/users/people/:id - [Sarpanch] Delete person
POST /api/notices - [Sarpanch] Add Notice
GET /api/notices - View Notices
DELETE /api/notices/:id - [Sarpanch] Delete Notice
(Add other key endpoints...)
Contributing
(Optional: Add guidelines if you want others to contribute)
Contributions are welcome! Please follow standard fork/pull request procedures. Ensure code adheres to existing style and includes tests where applicable.
License
This project is licensed under the MIT License - see the LICENSE.md file for details (if you create one).
