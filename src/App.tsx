import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Contributions from './pages/Contributions';
import Claims from './pages/Claims';
import Beneficiaries from './pages/Beneficiaries';
import Medical from './pages/Medical';
import Voting from './pages/Voting';

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

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
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
      <AppContent />
    </AuthProvider>
  );
};

export default App;