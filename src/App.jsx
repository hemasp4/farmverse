import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/Authcontext';
import { GameProvider } from './contexts/GameContext';
import { GrowthProvider } from './contexts/GrowthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import { initializeFirestore, prefetchUserData } from './services/initFirestore';
import FirebaseStatus from './components/common/FirebaseStatus';
import NetworkStatus from './components/common/NetworkStatus';
import CoinAnimation from './components/common/CoinAnimation';
import { useGame } from './contexts/GameContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FarmPage from './pages/FarmPage';
import MarketPage from './pages/MarketPage';
import LeaderboardPage from './pages/LeaderboardPage';

// Coin Animation Wrapper Component
function CoinAnimationWrapper() {
  const { coinAnimation, setCoinAnimation } = useGame();
  
  const handleAnimationComplete = () => {
    setCoinAnimation({ isVisible: false, amount: 0 });
  };
  
  return (
    <CoinAnimation 
      amount={coinAnimation.amount} 
      isVisible={coinAnimation.isVisible} 
      onComplete={handleAnimationComplete} 
    />
  );
}


function AppContent() {
  return (
    <>
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
      </Routes>
      
      <CoinAnimationWrapper />
      <NetworkStatus />
      {process.env.NODE_ENV === 'development' && <FirebaseStatus />}
    </>
  );
}

function App() {
  useEffect(() => {
    // Initialize Firestore with default data if needed
    initializeFirestore().catch(console.error);

    // Prefetch user data if user is already logged in
    const userId = localStorage.getItem('farmverse_userId');
    if (userId) {
      prefetchUserData(userId).catch(console.error);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <GrowthProvider>
            <AppContent />
          </GrowthProvider>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
