import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CareersPage from './pages/CareersPage';
import GamePage from './pages/GamePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import GameManagementPage from './pages/GameManagementPage';
import NewsManagementPage from './pages/NewsManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import Navigation from './components/Navigation';
import AgeVerificationModal from './components/AgeVerificationModal';
import FloatingContactButton from './components/FloatingContactButton';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
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
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;