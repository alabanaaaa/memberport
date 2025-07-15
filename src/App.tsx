import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { Layout } from './components/Layout/Layout';
import { AdminLayout } from './components/Admin/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Contributions from './pages/Contributions';
import Claims from './pages/Claims';
import Beneficiaries from './pages/Beneficiaries';
import Medical from './pages/Medical';
import Voting from './pages/Voting';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MemberManagement from './pages/Admin/MemberManagement';
import ApprovalsManagement from './pages/Admin/ApprovalsManagement';
import BulkOperations from './pages/Admin/BulkOperations';
import ClaimsManagement from './pages/Admin/ClaimsManagement';
import ClaimsProcessing from './pages/Admin/ClaimsProcessing';
import ContributionManagement from './pages/Admin/ContributionManagement';
import MedicalAdministration from './pages/Admin/MedicalAdministration';
import VotingManagement from './pages/Admin/VotingManagement';
import SystemIntegrations from './pages/Admin/SystemIntegrations';
import PortalManagement from './pages/Admin/PortalManagement';
import ReportsAnalytics from './pages/Admin/ReportsAnalytics';
import SystemConfiguration from './pages/Admin/SystemConfiguration';
import SystemAlerts from './pages/Admin/SystemAlerts';
import AuditTrail from './pages/Admin/AuditTrail';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  const isAdmin = user && ['Super Admin', 'Pension Officer', 'Finance Officer', 'Medical Officer', 'Approver'].includes(user.role);
  return isAdmin ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // Helper function to determine redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return "/login";
    const isAdmin = ['Super Admin', 'Pension Officer', 'Finance Officer', 'Medical Officer', 'Approver'].includes(user.role);
    return isAdmin ? "/admin/dashboard" : "/dashboard";
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={getRedirectPath()} /> : <Login />} />
        <Route path="/" element={<Navigate to={getRedirectPath()} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/contributions" element={
          <ProtectedRoute>
            <Layout>
              <Contributions />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/claims" element={
          <ProtectedRoute>
            <Layout>
              <Claims />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/beneficiaries" element={
          <ProtectedRoute>
            <Layout>
              <Beneficiaries />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/medical" element={
          <ProtectedRoute>
            <Layout>
              <Medical />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/voting" element={
          <ProtectedRoute>
            <Layout>
              <Voting />
            </Layout>
          </ProtectedRoute>
        } />
        {/* Placeholder routes for other features */}
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/members" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <MemberManagement />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/approvals" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <ApprovalsManagement />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/bulk" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <BulkOperations />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/claims" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <ClaimsProcessing />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/contributions" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <ContributionManagement />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/medical" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <MedicalAdministration />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/voting" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <VotingManagement />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/integrations" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <SystemIntegrations />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/portal" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <PortalManagement />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/config" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <SystemConfiguration />
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminProvider>
              <AdminLayout>
                <div className="text-center py-8">
                  <h1 className="text-2xl font-bold">Admin Module</h1>
                  <p className="text-gray-600">This admin module is under development...</p>
                </div>
              </AdminLayout>
            </AdminProvider>
          </AdminRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <div className="text-center py-8">
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-gray-600">Reports module coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Layout>
              <div className="text-center py-8">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-gray-600">Notifications module coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <div className="text-center py-8">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-gray-600">Settings module coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </AuthProvider>
  );
};

export default App;