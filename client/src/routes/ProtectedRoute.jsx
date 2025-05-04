// client/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

// This component protects routes that require authentication.
// It can optionally also check for specific user roles.
const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user, loading } = useAuth(); // Get auth state
  const location = useLocation(); // Get current location to redirect back after login

  // 1. Show loading indicator while initial auth check is running
  if (loading) {
    // You can replace this with a proper spinner component
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl text-gray-600">Loading Authentication...</div>
            {/* Or <Spinner /> */}
        </div>
    );
  }

  // 2. Check if user is logged in
  if (!isLoggedIn) {
    // User not logged in, redirect to login page
    // Pass the current location state so we can redirect back after login
    console.log("ProtectedRoute: Not logged in, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
    // 'replace' avoids adding the protected route to browser history
  }

  // 3. (Optional) Check if user has one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
      // Make sure user object and user.role exist before checking includes
      const hasRequiredRole = user?.role && allowedRoles.includes(user.role);

      if (!hasRequiredRole) {
          // User is logged in but does not have the required role
          // Redirect to an 'Unauthorized' page or back to home/previous safe page
           console.log(`ProtectedRoute: Role [${user?.role}] not allowed. Allowed: [${allowedRoles.join(', ')}]. Redirecting.`);
          // Option A: Redirect to a dedicated Unauthorized page (create this page later)
          // return <Navigate to="/unauthorized" replace />;
          // Option B: Redirect to home page
           return <Navigate to="/" replace />;
      }
  }

  // 4. User is logged in and has the required role (or no specific role required)
  // Render the child route component using <Outlet />
  // console.log("ProtectedRoute: Access granted.");
  return <Outlet />;
};

export default ProtectedRoute;