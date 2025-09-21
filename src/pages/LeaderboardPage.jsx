import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/Authcontext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LeaderboardPage() {
  const { currentUser } = useAuth();
  const [wealthLeaders, setWealthLeaders] = useState([]);
  const [levelLeaders, setLevelLeaders] = useState([]);
  const [cropLeaders, setCropLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wealth');
  
  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setLoading(true);
        
        // Fetch wealth leaders (by coins)
        const wealthQuery = query(
          collection(db, 'users'),
          orderBy('coins', 'desc'),
          limit(10)
        );
        const wealthSnapshot = await getDocs(wealthQuery);
        const wealthData = [];
        
        wealthSnapshot.forEach((doc) => {
          wealthData.push({
            id: doc.id,
            ...doc.data(),
            isCurrentUser: doc.id === currentUser?.uid
          });
        });
        
        setWealthLeaders(wealthData);
        
        // Fetch level leaders
        const levelQuery = query(
          collection(db, 'users'),
          orderBy('level', 'desc'),
          orderBy('experience', 'desc'),
          limit(10)
        );
        const levelSnapshot = await getDocs(levelQuery);
        const levelData = [];
        
        levelSnapshot.forEach((doc) => {
          levelData.push({
            id: doc.id,
            ...doc.data(),
            isCurrentUser: doc.id === currentUser?.uid
          });
        });
        
        setLevelLeaders(levelData);
        
        // Fetch crop leaders (number of crops planted - simplified approach)
        // In a real implementation, this would require more complex aggregation
        // This is just a placeholder to demonstrate the UI
        const cropQuery = query(
          collection(db, 'users'),
          orderBy('experience', 'desc'), // Using experience as a proxy for crops planted
          limit(10)
        );
        const cropSnapshot = await getDocs(cropQuery);
        const cropData = [];
        
        cropSnapshot.forEach((doc) => {
          cropData.push({
            id: doc.id,
            ...doc.data(),
            cropCount: Math.floor(doc.data().experience / 10), // Simplified estimate
            isCurrentUser: doc.id === currentUser?.uid
          });
        });
        
        setCropLeaders(cropData);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboards();
  }, [currentUser]);
  
  const getAvatarEmoji = (userId, avatarId = 1) => {
    // Simple hash function to get consistent emoji based on user ID
    const hashCode = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const emojis = ['👨‍🌾', '👩‍🌾', '🧑‍🌾', '👵', '👴'];
    return emojis[avatarId ? (avatarId - 1) % emojis.length : hashCode % emojis.length];
  };
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Farmer Leaderboards</h1>
        
        {/* Leaderboard Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'wealth' 
                ? 'text-farm-green border-b-2 border-farm-green' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('wealth')}
          >
            Wealthiest Farmers
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'level' 
                ? 'text-farm-green border-b-2 border-farm-green' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('level')}
          >
            Highest Level
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'crops' 
                ? 'text-farm-green border-b-2 border-farm-green' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('crops')}
          >
            Most Crops
          </button>
        </div>
        
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Wealth Leaderboard */}
            {activeTab === 'wealth' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wealth
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wealthLeaders.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={user.isCurrentUser ? 'bg-green-50' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                              {getAvatarEmoji(user.id, user.avatarId)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.username || `Farmer-${user.id.substring(0, 5)}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.farmName || 'Unnamed Farm'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Level {user.level}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-yellow-600 font-semibold">{user.coins} coins</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Level Leaderboard */}
            {activeTab === 'level' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {levelLeaders.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={user.isCurrentUser ? 'bg-green-50' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                              {getAvatarEmoji(user.id, user.avatarId)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.username || `Farmer-${user.id.substring(0, 5)}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.farmName || 'Unnamed Farm'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Level {user.level}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.experience} XP</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Crop Leaderboard */}
            {activeTab === 'crops' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crops Planted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farm Size
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cropLeaders.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={user.isCurrentUser ? 'bg-green-50' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                              {getAvatarEmoji(user.id, user.avatarId)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.username || `Farmer-${user.id.substring(0, 5)}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.farmName || 'Unnamed Farm'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.cropCount} crops</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.land || 4} plots</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">How to Climb the Ranks</h3>
          <ul className="text-blue-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">🌱</span>
              <span>Plant more crops to earn experience and increase your level</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💰</span>
              <span>Sell crops at peak market prices to maximize your wealth</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⏱️</span>
              <span>Log in daily to collect rewards and tend to your farm</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📈</span>
              <span>Reinvest your earnings to expand your farm and grow more crops</span>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
