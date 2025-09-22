import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../components/dashboard/Dashboard';
import { useAuth } from '../contexts/Authcontext';
import { useGame } from '../contexts/GameContext';
import { createNotification } from '../services/notificationService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { currentUser, dailyReward, loading } = useAuth();
  const { showCoinChange } = useGame();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);

  useEffect(() => {
    if (dailyReward && dailyReward.rewarded) {
      setShowDailyReward(true);
      if (showCoinChange) {
        showCoinChange(dailyReward.coins);
      }
      createNotification(
        currentUser.uid,
        'Daily Reward!',
        `You\'ve received ${dailyReward.coins} coins as your daily login reward.`,
        'reward'
      );
    }
  }, [dailyReward, currentUser, showCoinChange]);

  // Show welcome message on first render
  useEffect(() => {
    setShowWelcome(true);
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading && !currentUser) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Welcome overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 text-center transition-transform transform bg-white rounded-lg">
            <div className="mb-4 text-5xl">👋</div>
            <h2 className="mb-2 text-2xl font-bold">Welcome back to your farm!</h2>
            <p className="text-gray-600">Let's see how your crops are doing today.</p>
            
            {/* Show current coin amount */}
            {currentUser && (
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="text-gray-700">Your current balance:</p>
                <p className="flex items-center justify-center text-2xl font-bold text-yellow-600">
                  <span className="mr-2 text-yellow-500">💰</span>
                  {typeof currentUser.coins === 'number' ? currentUser.coins.toLocaleString() : '0'} coins
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Daily reward notification */}
      {showDailyReward && (
        <div className="fixed z-40 max-w-xs p-4 border border-yellow-200 rounded-lg shadow-lg bottom-4 right-4 bg-yellow-50 animate-fade-in-up">
          <div className="flex items-start">
            <div className="mr-3 text-2xl">🎁</div>
            <div>
              <h4 className="font-bold text-yellow-800">Daily Reward!</h4>
              <p className="text-sm text-yellow-700">You've received coins for logging in today.</p>
              <div className="flex items-center mt-1">
                <span className="mr-1 text-yellow-500">💰</span>
                <span className="font-bold">+{dailyReward.coins} coins</span>
              </div>
              <button 
                onClick={() => setShowDailyReward(false)}
                className="mt-2 text-xs text-yellow-600 hover:text-yellow-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Dashboard />
    </MainLayout>
  );
}
