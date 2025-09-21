import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Authcontext';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
}
