import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/Authcontext';
import PrivateRoute from './components/auth/PrivateRoute';
import NetworkStatus from './components/common/NetworkStatus';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages (lazy-loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FarmPage = lazy(() => import('./pages/FarmPage'));
const MarketPage = lazy(() => import('./pages/MarketPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));

function AppContent() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/farm" 
            element={
              <PrivateRoute>
                <FarmPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/market" 
            element={
              <PrivateRoute>
                <MarketPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <PrivateRoute>
                <LeaderboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/news" 
            element={
              <PrivateRoute>
                <NewsPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Suspense>
      
      <NetworkStatus />
    </>
  );
}

import { NotificationProvider } from './contexts/NotificationContext';

import { GameProvider } from './contexts/GameContext';
import { GrowthProvider } from './contexts/GrowthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <GameProvider>
            <GrowthProvider>
              <AppContent />
            </GrowthProvider>
          </GameProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
