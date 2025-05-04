// client/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        {/* Desktop Navbar */}
        <div className="hidden md:flex justify-between items-center">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="text-2xl font-bold hover:text-green-200 transition duration-300 flex items-center"
          >
            <span className="mr-2">🏛️</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-white">
              GramSeva Portal
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-md hover:bg-green-600 hover:shadow-md transition-all duration-300 font-medium flex items-center"
            >
              <span className="mr-1">🏠</span> Home
            </Link>

            {isLoggedIn ? (
              <>
                {user?.role === 'sarpanch' && (
                  <Link
                    to="/sarpanch-dashboard"
                    className="px-3 py-2 rounded-md hover:bg-green-600 hover:shadow-md transition-all duration-300 font-medium flex items-center"
                  >
                    <span className="mr-1">📊</span> Sarpanch Board
                  </Link>
                )}
                {user?.role === 'people' && (
                  <Link
                    to="/people-dashboard"
                    className="px-3 py-2 rounded-md hover:bg-green-600 hover:shadow-md transition-all duration-300 font-medium flex items-center"
                  >
                    <span className="mr-1">📋</span> My Dashboard
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 hover:shadow-md transition-all duration-300 font-medium flex items-center ml-2"
                >
                  <span className="mr-1">🚪</span> Logout
                </button>
                
                <div className="ml-3 px-3 py-1 bg-green-800 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span className="text-sm font-medium">Hi, {user?.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md hover:bg-green-600 hover:shadow-md transition-all duration-300 font-medium flex items-center"
                >
                  <span className="mr-1">🔑</span> Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md bg-white text-green-700 hover:bg-green-100 hover:shadow-md transition-all duration-300 font-medium flex items-center ml-2"
                >
                  <span className="mr-1">📝</span> Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex justify-between items-center">
          <Link 
            to="/" 
            className="text-xl font-bold hover:text-green-200 transition duration-300 flex items-center"
          >
            <span className="mr-1">🏛️</span>
            <span>GramSeva</span>
          </Link>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-green-600 transition duration-200 font-medium"
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                {user?.role === 'sarpanch' && (
                  <Link
                    to="/sarpanch-dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-green-600 transition duration-200 font-medium"
                  >
                    Sarpanch Board
                  </Link>
                )}
                {user?.role === 'people' && (
                  <Link
                    to="/people-dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-green-600 transition duration-200 font-medium"
                  >
                    My Dashboard
                  </Link>
                )}
                
                <div className="block px-3 py-2 text-sm font-medium">
                  <span>Logged in as: </span>
                  <span className="text-green-200">{user?.name}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-green-600 transition duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md bg-white text-green-700 hover:bg-green-100 transition duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;