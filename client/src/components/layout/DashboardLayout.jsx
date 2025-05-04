import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiBell, 
  FiAlertCircle, 
  FiBriefcase, 
  FiFileText, 
  FiTool, 
  FiUser, 
  FiPlusCircle,
  FiCheckCircle,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Icons mapping for navigation items
const navIcons = {
  'Overview': <FiHome />,
  'View People': <FiUsers />,
  'Add Notice': <FiPlusCircle />,
  'View Notices': <FiBell />,
  'View Complaints': <FiAlertCircle />,
  'Add Scheme': <FiPlusCircle />,
  'View Schemes': <FiFileText />,
  'Add Job': <FiPlusCircle />,
  'View Jobs': <FiBriefcase />,
  'Add Work Done': <FiPlusCircle />,
  'View Work Done': <FiTool />,
  'My Profile': <FiUser />,
  'Send Complaint': <FiAlertCircle />,
  'My Complaints': <FiCheckCircle />
};

const sarpanchNavLinks = [
  { name: 'Overview', path: '/sarpanch' },
  { name: 'View People', path: '/sarpanch/people' },
  { name: 'Add Notice', path: '/sarpanch/notices/add' },
  { name: 'View Notices', path: '/sarpanch/notices' },
  { name: 'View Complaints', path: '/sarpanch/complaints' },
  { name: 'Add Scheme', path: '/sarpanch/schemes/add' },
  { name: 'View Schemes', path: '/sarpanch/schemes' },
  { name: 'Add Job', path: '/sarpanch/jobs/add' },
  { name: 'View Jobs', path: '/sarpanch/jobs' },
  { name: 'Add Work Done', path: '/sarpanch/works/add' },
  { name: 'View Work Done', path: '/sarpanch/works' },
  { name: 'My Profile', path: '/sarpanch/profile' },
];

const peopleNavLinks = [
  { name: 'Overview', path: '/people' },
  { name: 'View Notices', path: '/people/notices' },
  { name: 'View Schemes', path: '/people/schemes' },
  { name: 'View Jobs', path: '/people/jobs' },
  { name: 'Send Complaint', path: '/people/complaints/new' },
  { name: 'My Complaints', path: '/people/my-complaints' },
  { name: 'View Work Done', path: '/people/works' },
];

function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user?.role === 'sarpanch' ? sarpanchNavLinks :
                   user?.role === 'people' ? peopleNavLinks : [];

  // Theme configuration
  const theme = {
    bg: user?.role === 'sarpanch' ? 'bg-green-700' : 'bg-blue-700',
    hover: user?.role === 'sarpanch' ? 'hover:bg-green-600' : 'hover:bg-blue-600',
    active: user?.role === 'sarpanch' ? 'bg-green-800' : 'bg-blue-800',
    text: 'text-white',
    border: user?.role === 'sarpanch' ? 'border-green-600' : 'border-blue-600',
    icon: user?.role === 'sarpanch' ? 'text-green-200' : 'text-blue-200'
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/sarpanch' && path !== '/people' && location.pathname.startsWith(path));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">
          {user?.role === 'sarpanch' ? 'Sarpanch Dashboard' : 'Village Portal'}
        </h1>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar - Hidden on mobile unless toggled */}
      <AnimatePresence>
        {(mobileMenuOpen || !window.matchMedia('(max-width: 768px)').matches) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-20 w-64 ${theme.bg} ${theme.text} flex-shrink-0 shadow-lg h-screen md:h-auto`}
          >
            <div className="p-4 sticky top-0 h-screen overflow-y-auto">
              {/* Enhanced Sidebar Header */}
              <div className="mb-6 px-2 py-3 border-b border-opacity-20 border-white">
                <h2 className="text-xl font-bold flex items-center">
                  <span className={`${theme.icon} mr-2`}>
                    {user?.role === 'sarpanch' ? '👑' : '👨‍🌾'}
                  </span>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Panel
                </h2>
                <p className="text-xs opacity-80 mt-1">Welcome back, {user?.name}</p>
              </div>

              {/* Navigation with enhanced styling */}
              <nav>
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.name} className="mb-1">
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-3 py-3 rounded-md transition-all duration-200 ${theme.hover} ${
                          isActive(link.path) 
                            ? `${theme.active} font-medium shadow-inner`
                            : 'opacity-90 hover:opacity-100'
                        }`}
                      >
                        <span className={`${theme.icon} mr-3`}>
                          {navIcons[link.name]}
                        </span>
                        <span>{link.name}</span>
                        {isActive(link.path) && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Sidebar Footer */}
              <div className="mt-6 pt-4 border-t border-opacity-20 border-white">
                <div className="flex items-center text-xs px-2 opacity-80">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                  Active Session
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area with subtle animation */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-grow p-4 sm:p-6 bg-gray-50 overflow-auto"
      >
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}

export default DashboardLayout;