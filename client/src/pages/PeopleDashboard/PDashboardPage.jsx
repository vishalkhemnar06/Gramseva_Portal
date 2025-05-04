// client/src/pages/PeopleDashboard/PDashboardPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Get the server base URL from environment variables
const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5001';

function PDashboardPage() {
     const { user } = useAuth();

     // Construct the full image URL
    const profileImageUrl = user?.profilePhoto && user.profilePhoto !== 'no-photo.jpg'
        ? `${SERVER_URL}/${user.profilePhoto}`
        : 'https://via.placeholder.com/150/0000FF/FFFFFF?text=M'; // Placeholder/Default image URL (Blue background 'M' for Member)


    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-center mb-6 border-b pb-4">
                {/* Profile Image */}
                 <img
                    onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150/cccccc/FFFFFF?text=?' }}
                    src={profileImageUrl}
                    alt={`${user?.name}'s profile`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-md mb-4 sm:mb-0 sm:mr-6" // Adjusted border color
                />
                 {/* Welcome Text */}
                 <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                        Member Dashboard
                    </h1>
                    {user ? (
                        <>
                            <p className="text-lg text-gray-700 mt-1">
                                Welcome, <span className="font-semibold">{user.name}</span>!
                            </p>
                            <p className="text-md text-gray-600">
                                Your Village: <span className="font-semibold">{user.villageName}</span>
                            </p>
                        </>
                    ) : (
                        <p className="text-lg text-gray-700">Loading user information...</p>
                    )}
                </div>
            </div>


            {/* Placeholder for dashboard content */}
            <div className="mt-6">
                 <h2 className="text-xl font-semibold text-gray-800 mb-3">Overview</h2>
                <p className="text-gray-600">
                    Use the menu on the left to view village notices, government schemes, job opportunities, submit complaints, and see the work done by the Gram Panchayat.
                </p>
            </div>
        </div>
    );
}

export default PDashboardPage;