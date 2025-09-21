import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../components/dashboard/Dashboard';
import { useAuth } from '../contexts/Authcontext';
import { useGame } from '../contexts/GameContext';
import { createNotification } from '../services/notificationService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { currentUser, userData, checkDailyLoginReward } = useAuth();
  const { showCoinChange } = useGame();
  const [showWelcome, setShowWelcome] = useState(false);
  const [dailyReward, setDailyReward] = useState({ 
    show: false, 
    coins: 0 
  });
  const [loading, setLoading] = useState(true);
  
  // Check for daily login reward
  useEffect(() => {
    if (!currentUser) return;
    
    async function checkReward() {
      try {
        setLoading(true);
        const rewardResult = await checkDailyLoginReward(currentUser.uid);
        console.log("Daily reward check result:", rewardResult);
        
        if (rewardResult.rewarded) {
          setDailyReward({ 
            show: true, 
            coins: rewardResult.coins 
          });
          
          // Show coin animation
          if (showCoinChange) {
            showCoinChange(rewardResult.coins);
          }
          
          // Create notification for daily reward
          await createNotification(
            currentUser.uid,
            'Daily Reward!',
            `You've received ${rewardResult.coins} coins as your daily login reward.`,
            'reward'
          );
        }
      } catch (error) {
        console.error('Error checking daily login reward:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkReward();
  }, [currentUser, showCoinChange]);
  
  // Show welcome message on first render
  useEffect(() => {
    setShowWelcome(true);
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading && !userData) {
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center transform transition-transform">
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-bold mb-2">Welcome back to your farm!</h2>
            <p className="text-gray-600">Let's see how your crops are doing today.</p>
            
            {/* Show current coin amount */}
            {userData && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-700">Your current balance:</p>
                <p className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                  <span className="text-yellow-500 mr-2">💰</span>
                  {userData.coins.toLocaleString()} coins
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Daily reward notification */}
      {dailyReward.show && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-40 max-w-xs animate-fade-in-up">
          <div className="flex items-start">
            <div className="text-2xl mr-3">🎁</div>
            <div>
              <h4 className="font-bold text-yellow-800">Daily Reward!</h4>
              <p className="text-sm text-yellow-700">You've received coins for logging in today.</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 mr-1">💰</span>
                <span className="font-bold">+{dailyReward.coins} coins</span>
              </div>
              <button 
                onClick={() => setDailyReward({ show: false, coins: 0 })}
                className="text-xs text-yellow-600 hover:text-yellow-800 mt-2"
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
