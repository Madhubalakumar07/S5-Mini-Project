import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { StaffLayout } from './layouts/StaffLayout';

// Student Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { Academics } from './pages/Academics';
import { Placement } from './pages/Placement';
import { Profile, Notifications, Settings } from './pages/Secondary';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffStudentsAttendance } from './pages/staff/StaffStudentsAttendance';
import { StaffAcademics } from './pages/staff/StaffAcademics';
import { StaffPlacement } from './pages/staff/StaffPlacement';
import { StaffSupportReports } from './pages/staff/StaffSupportReports';
import { StaffAnnouncements } from './pages/staff/StaffAnnouncements';
import { StaffProfile } from './pages/staff/StaffProfile';

const RoleBasedRootRedirect: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'staff' ? '/staff/dashboard' : '/dashboard'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Root Redirect based on logged in role */}
          <Route path="/" element={<RoleBasedRootRedirect />} />

          {/* Protected Student Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/placement" element={<Placement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Protected Staff Routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="students-attendance" element={<StaffStudentsAttendance />} />
            <Route path="academics" element={<StaffAcademics />} />
            <Route path="placement" element={<StaffPlacement />} />
            <Route path="support-reports" element={<StaffSupportReports />} />
            <Route path="announcements" element={<StaffAnnouncements />} />
            <Route path="profile" element={<StaffProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<RoleBasedRootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
