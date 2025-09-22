import React, { useState } from 'react';
import { useAuth } from '../../contexts/Authcontext';
import { useGame } from '../../contexts/GameContext';
import FarmStats from './FarmStats';
import NotificationCenter from './NotificationCenter';
import TransactionHistory from './TransactionHistory';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { crops, cropCatalog } = useGame();
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  
  if (!currentUser) {
    return <div className="text-center py-8">Loading your farm data...</div>;
  }
  
  // Calculate crop distribution data for pie chart
  const getCropDistribution = () => {
    const distribution = {};
    
    crops.forEach(crop => {
      if (distribution[crop.type]) {
        distribution[crop.type]++;
      } else {
        distribution[crop.type] = 1;
      }
    });
    
    return Object.entries(distribution).map(([type, count]) => ({
      name: cropCatalog[type].name,
      value: count,
      color: getCropColor(type)
    }));
  };
  
  const getCropColor = (type) => {
    const colors = {
      wheat: '#F9D923',
      corn: '#F8B400',
      tomato: '#EB5353',
      carrot: '#F37121'
    };
    
    return colors[type] || '#36AE7C';
  };
  
  const cropData = getCropDistribution();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Farm Stats */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Welcome to your Farm!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Farmer Profile Card */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Farmer Profile</h3>
              <div className="space-y-2">
                <p><strong>Username:</strong> {currentUser.username}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Land Size:</strong> {currentUser.land} plots</p>
              </div>
            </div>
            
            {/* Coins Card */}
            <div className="card cursor-pointer" onClick={() => setShowTransactionHistory(true)}>
            <h3 className="text-lg font-semibold mb-2">Farm Treasury</h3>
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-sunny-yellow rounded-full flex items-center justify-center text-2xl">
                💰
                </div>
                <div>
                <p className="text-3xl font-bold text-yellow-600">{currentUser.coins.toLocaleString()}</p>
                <p className="text-gray-600">Coins available</p>
                <p className="text-xs text-gray-500 mt-1">Click to view transaction history</p>
                </div>
            </div>
            </div>
            </div>
          
          {/* Farm Stats */}
          <FarmStats />
          
          {/* Crop Distribution */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold mb-4">Crop Distribution</h3>
            {cropData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {cropData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No crops planted yet. Visit your farm to start planting!
              </p>
            )}
          </div>
        </div>
        
        {/* Right Column: Notifications */}
        <div>
          <NotificationCenter />
        </div>
      </div>
      {showTransactionHistory && (
        <TransactionHistory onClose={() => setShowTransactionHistory(false)} />
      )}
    </div>
  );
}
