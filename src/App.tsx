import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CareersPage from './pages/CareersPage';
import ZeusGamePage from './pages/ZeusGamePage';
import Navigation from './components/Navigation';
import AgeVerificationModal from './components/AgeVerificationModal';
import FloatingContactButton from './components/FloatingContactButton';

function App() {
  return (
    <div className="bg-black text-white">
      <AgeVerificationModal />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/games/zeus-clockwork-tyrant" element={<ZeusGamePage />} />
      </Routes>
      <FloatingContactButton />
    </div>
  );
}

export default App;