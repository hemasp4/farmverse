import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { useAuth } from '../../contexts/Authcontext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

export default function MainLayout({ children, requireAuth = true }) {
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();
  
  // Check if user needs profile setup
  React.useEffect(() => {
    if (requireAuth && currentUser && userData && !userData.profileSetupComplete) {
      navigate('/profile-setup');
    }
  }, [currentUser, userData, requireAuth, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // If auth is required but user is not logged in, redirect to login
  if (requireAuth && !currentUser) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
}
