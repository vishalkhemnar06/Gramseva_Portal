// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Core Components & Pages ---
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Routing & Layout ---
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// --- Dashboard Index Pages ---
import SDashboardPage from './pages/SarpanchDashboard/SDashboardPage';
import PDashboardPage from './pages/PeopleDashboard/PDashboardPage';

// --- Sarpanch Pages ---
import SViewComplaintsPage from './pages/SarpanchDashboard/SViewComplaintsPage';
import SViewPeoplePage from './pages/SarpanchDashboard/SViewPeoplePage';
import SAddNoticePage from './pages/SarpanchDashboard/SAddNoticePage';
import SAddSchemePage from './pages/SarpanchDashboard/SAddSchemePage';
import SAddJobPage from './pages/SarpanchDashboard/SAddJobPage';
import SAddWorkPage from './pages/SarpanchDashboard/SAddWorkPage';
import SProfilePage from './pages/SarpanchDashboard/SProfilePage'; 


// --- People Pages ---
import PMyComplaintsPage from './pages/PeopleDashboard/PMyComplaintsPage';
import PSendComplaintPage from './pages/PeopleDashboard/PSendComplaintPage';

// --- Common Pages (Used by both roles) ---
import ViewNoticesPage from './components/common/ViewNoticesPage';
import ViewSchemesPage from './components/common/ViewSchemesPage';
import ViewJobsPage from './components/common/ViewJobsPage';
import ViewWorksPage from './components/common/ViewWorkDonePage';
import ViewWorkDonePage from './components/common/ViewWorkDonePage';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* === Protected Sarpanch Routes === */}
          <Route element={<ProtectedRoute allowedRoles={['sarpanch']} />}>
            <Route element={<DashboardLayout />}>
            <Route path="/sarpanch/profile" element={<SProfilePage />} />
              {/* Dashboard Home */}
              <Route path="/sarpanch" element={<SDashboardPage />} />
              
              {/* Complaints Management */}
              <Route path="/sarpanch/complaints" element={<SViewComplaintsPage />} />
              
              {/* People Management */}
              <Route path="/sarpanch/people" element={<SViewPeoplePage />} />
              
              {/* Notices */}
              <Route path="/sarpanch/notices" element={<ViewNoticesPage />} />
              <Route path="/sarpanch/notices/add" element={<SAddNoticePage />} />
              
              {/* Schemes */}
              <Route path="/sarpanch/schemes" element={<ViewSchemesPage />} />
              <Route path="/sarpanch/schemes/add" element={<SAddSchemePage />} />
              
              {/* Jobs */}
              <Route path="/sarpanch/jobs" element={<ViewJobsPage />} />
              <Route path="/sarpanch/jobs/add" element={<SAddJobPage />} />
              
              {/* Works */}
              <Route path="/sarpanch/works" element={<ViewWorkDonePage />} /> {/* Renders at /sarpanch/works */}
              <Route path="/sarpanch/works/add" element={<SAddWorkPage />} />
              
              {/* Legacy/Backward compatibility routes */}
              <Route path="/sarpanch-dashboard" element={<SDashboardPage />} />
              <Route path="/sarpanch-dashboard/view-complaints" element={<SViewComplaintsPage />} />
              <Route path="/sarpanch-dashboard/view-people" element={<SViewPeoplePage />} />
              <Route path="/sarpanch-dashboard/view-notices" element={<ViewNoticesPage />} />
              <Route path="/sarpanch-dashboard/add-notice" element={<SAddNoticePage />} />
              <Route path="/sarpanch-dashboard/view-schemes" element={<ViewSchemesPage />} />
              <Route path="/sarpanch-dashboard/add-scheme" element={<SAddSchemePage />} />
              <Route path="/sarpanch-dashboard/view-jobs" element={<ViewJobsPage />} />
              <Route path="/sarpanch-dashboard/add-job" element={<SAddJobPage />} />
            </Route>
          </Route>

          {/* === Protected People Routes === */}
          <Route element={<ProtectedRoute allowedRoles={['people']} />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard Home */}
              <Route path="/people" element={<PDashboardPage />} />
              
              {/* Complaints */}
              <Route path="/people/my-complaints" element={<PMyComplaintsPage />} />
              <Route path="/people/complaints/new" element={<PSendComplaintPage />} />
              
              {/* Information Access */}
              <Route path="/people/notices" element={<ViewNoticesPage />} />
              <Route path="/people/schemes" element={<ViewSchemesPage />} />
              <Route path="/people/jobs" element={<ViewJobsPage />} />
              <Route path="/people/works" element={<ViewWorksPage />} />
              
              {/* Legacy/Backward compatibility routes */}
              <Route path="/people-dashboard" element={<PDashboardPage />} />
              <Route path="/people-dashboard/my-complaints" element={<PMyComplaintsPage />} />
              <Route path="/people-dashboard/send-complaint" element={<PSendComplaintPage />} />
              <Route path="/people-dashboard/view-notices" element={<ViewNoticesPage />} />
              <Route path="/people-dashboard/view-schemes" element={<ViewSchemesPage />} />
              <Route path="/people-dashboard/view-jobs" element={<ViewJobsPage />} />
              
            </Route>
          </Route>

          {/* === Catch-all route (404) === */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;