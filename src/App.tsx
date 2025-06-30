import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CareersPage from './pages/CareersPage';
import BackofficePage from './pages/BackofficePage';
import GamePage from './pages/GamePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import GameManagementPage from './pages/GameManagementPage';
import NewsManagementPage from './pages/NewsManagementPage';
import CareersManagementPage from './pages/CareersManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Navigation from './components/Navigation';
import AgeVerificationModal from './components/AgeVerificationModal';
import FloatingContactButton from './components/FloatingContactButton';
import ProtectedRoute from './components/ProtectedRoute';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  // Initialize analytics tracking
  useAnalytics();

  return (
    <div className="bg-black text-white">
      <AgeVerificationModal />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navigation />
            <HomePage />
            <FloatingContactButton />
          </>
        } />
        <Route path="/careers" element={
          <>
            <Navigation />
            <CareersPage />
            <FloatingContactButton />
          </>
        } />
        <Route path="/backoffice" element={
          <>
            <Navigation />
            <BackofficePage />
            <FloatingContactButton />
          </>
        } />
        <Route path="/privacy-policy" element={
          <>
            <Navigation />
            <PrivacyPolicyPage />
            <FloatingContactButton />
          </>
        } />
        <Route path="/cookies-policy" element={
          <>
            <Navigation />
            <CookiesPolicyPage />
            <FloatingContactButton />
          </>
        } />
        <Route path="/games/:gameSlug" element={
          <>
            <Navigation />
            <GamePage />
            <FloatingContactButton />
          </>
        } />
        
        {/* Admin Routes - Now with proper authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/games" element={
          <ProtectedRoute requireAdmin={true}>
            <GameManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/news" element={
          <ProtectedRoute requireAdmin={true}>
            <NewsManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/careers" element={
          <ProtectedRoute requireAdmin={true}>
            <CareersManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute requireAdmin={true}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;