import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark-gradient flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-300 font-body mb-6">
            You don't have permission to access this area. Please contact an administrator.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-brand-gradient text-brand-dark font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 font-body"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;