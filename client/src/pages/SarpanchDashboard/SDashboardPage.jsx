// client/src/pages/SarpanchDashboard/SDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion'; // For animations
import { FiUsers, FiAlertTriangle, FiFileText } from 'react-icons/fi'; // Icons
import CountUp from 'react-countup'; // Number animation

// Import API service functions
import { getPeopleForSarpanch } from '../../services/userService';
import { getComplaintsForVillage } from '../../services/complaintService';
// import { getSchemesForVillage } from '../../services/schemeService';
import { getSchemes } from '../../services/schemeService';

// Get the server base URL from environment variables
const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5001';

// Animation variants (optional)
const containerVariants = { /* ... as before ... */ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 }} };
const itemVariants = { /* ... as before ... */ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 }};

function SDashboardPage() {
    const { user } = useAuth();
    // Initialize stats
    const [stats, setStats] = useState({
        totalVillagers: 0,
        pendingComplaints: 0,
        totalSchemes: 0, // Changed from activeSchemes based on API
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dynamic data from API on component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            // Only fetch if the user is loaded (and is a sarpanch - though route protection handles this)
            if (!user) {
                 // If user data isn't available yet in context, wait.
                 // AuthContext loading state could also be used here.
                 // For now, we assume user is loaded if component renders.
                 // Or return early if critical data is missing.
                 // setIsLoading(false); // Or handle appropriately
                 console.log("SDashboard: Waiting for user data...");
                return;
            }

            setIsLoading(true);
            setError(null);
            console.log("SDashboard: Fetching dashboard counts...");

            try {
                // Fetch counts in parallel
                // We only need the totalCount, so request limit=1
                const [peopleData, complaintsData, schemesData] = await Promise.all([
                    getPeopleForSarpanch('', 1, 1), // Fetch people count (totalCount)
                    getComplaintsForVillage({ status: 'Pending', limit: 1 }), // Fetch pending complaints count (totalCount)
                    getSchemes({ limit: 1 }) // Fetch total schemes count (totalCount)
                ]);

                console.log("SDashboard: Data fetched:", { peopleData, complaintsData, schemesData });

                // Update state with totalCounts from responses
                setStats({
                    totalVillagers: peopleData?.totalCount || 0,
                    pendingComplaints: complaintsData?.totalCount || 0,
                    totalSchemes: schemesData?.totalCount || 0,
                });

            } catch (err) {
                console.error('SDashboard: Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard stats. Please refresh.');
                // Keep default stats as 0 on error
                setStats({ totalVillagers: 0, pendingComplaints: 0, totalSchemes: 0 });
            } finally {
                setIsLoading(false);
                 console.log("SDashboard: Fetching complete.");
            }
        };

        fetchDashboardData();
        // Dependency array - re-fetch if the user changes (e.g., on login)
        // Careful: could cause loop if user object reference changes unnecessarily
    }, [user]); // Re-run if user object changes

    // Construct the profile image URL
    const profileImageUrl = user?.profilePhoto && user.profilePhoto !== 'no-photo.jpg'
        ? `${SERVER_URL}/${user.profilePhoto}`
        : 'https://via.placeholder.com/150/008000/FFFFFF?text=S';

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-2 md:p-6" // Adjusted padding
        >
            {/* --- Profile/Welcome Section --- */}
            <motion.div
                variants={itemVariants}
                className="bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6 transition-shadow hover:shadow-xl"
            >
                <div className="flex flex-col sm:flex-row items-center">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150/cccccc/FFFFFF?text=?' }}
                        src={profileImageUrl}
                        alt={`${user?.name || 'Sarpanch'}'s profile`}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-green-200 shadow-md mb-4 sm:mb-0 sm:mr-6"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
                            Sarpanch Dashboard
                        </h1>
                        {user ? (
                            <>
                                <p className="text-lg text-gray-700">
                                    Welcome, <span className="font-semibold">{user.name}</span>!
                                </p>
                                <p className="text-md text-gray-600">
                                    Village: <span className="font-semibold">{user.villageName}</span>
                                </p>
                            </>
                        ) : (
                            <p className="text-lg text-gray-700">Loading...</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* --- Error Display --- */}
            {error && !isLoading && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 shadow" role="alert"
                >
                   <p><span className="font-bold">Error:</span> {error}</p>
                </motion.div>
            )}

            {/* --- Stats Cards Section --- */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8"
            >
                {/* Card: Total Villagers */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="stat-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                   <div className="stat-icon bg-blue-100 text-blue-600"> <FiUsers size={24} /> </div>
                   <div>
                        <p className="stat-label">Registered Villagers</p>
                         {isLoading ? <div className="stat-loading-pulse"></div> :
                            <h3 className="stat-value"><CountUp end={stats.totalVillagers} duration={1.5} /></h3>
                         }
                   </div>
                </motion.div>

                {/* Card: Pending Complaints */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="stat-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                   <div className="stat-icon bg-yellow-100 text-yellow-600"> <FiAlertTriangle size={24} /> </div>
                   <div>
                        <p className="stat-label">Pending Complaints</p>
                         {isLoading ? <div className="stat-loading-pulse"></div> :
                            <h3 className="stat-value"><CountUp end={stats.pendingComplaints} duration={1.5} /></h3>
                         }
                   </div>
                </motion.div>

                {/* Card: Total Schemes */}
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="stat-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                   <div className="stat-icon bg-purple-100 text-purple-600"> <FiFileText size={24} /> </div>
                   <div>
                        <p className="stat-label">Uploaded Schemes</p>
                         {isLoading ? <div className="stat-loading-pulse"></div> :
                            <h3 className="stat-value"><CountUp end={stats.totalSchemes} duration={1.5} /></h3>
                         }
                   </div>
                </motion.div>

                {/* Add more cards if needed (e.g., total notices, jobs) */}

            </motion.div>

            {/* Placeholder for other dashboard content */}
            <motion.div variants={itemVariants} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Quick Actions / Recent Activity</h2>
                <p className="text-gray-600">
                    (Further dashboard elements like recent notices, pending actions, etc., can be added here.)
                </p>
            </motion.div>

             {/* Add helper classes for stat cards in index.css or here */}
            <style jsx global>{`
                .stat-card { @apply p-4 rounded-lg shadow flex items-center border; }
                .stat-icon { @apply p-3 rounded-full mr-4; }
                .stat-label { @apply text-sm text-gray-500 font-medium; }
                .stat-value { @apply text-2xl font-bold text-gray-800; }
                .stat-loading-pulse { @apply h-7 w-16 bg-gray-200 rounded animate-pulse; }
            `}</style>

        </motion.div>
    );
}

export default SDashboardPage;