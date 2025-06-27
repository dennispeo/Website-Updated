import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CareersPage from './pages/CareersPage';
import ZeusGamePage from './pages/ZeusGamePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import GameManagementPage from './pages/GameManagementPage';
import NewsManagementPage from './pages/NewsManagementPage';
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
        <Route path="/games/:gameSlug" element={
          <>
            <Navigation />
            <ZeusGamePage />
            <FloatingContactButton />
          </>
        } />
        
        {/* Admin Routes - Temporarily without authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/games" element={<GameManagementPage />} />
        <Route path="/admin/news" element={<NewsManagementPage />} />
      </Routes>
    </div>
  );
}

export default App;