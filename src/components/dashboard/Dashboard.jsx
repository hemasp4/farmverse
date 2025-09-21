import React from 'react';
import { useAuth } from '../../contexts/Authcontext';
import { useGame } from '../../contexts/GameContext';
import FarmStats from './FarmStats';
import NotificationCenter from './NotificationCenter';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const { userData } = useAuth();
  const { crops, cropCatalog } = useGame();
  
  if (!userData) {
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
  
  // Calculate progress to next level (basic formula)
  const expToNextLevel = userData.level * 100;
  const levelProgress = (userData.experience / expToNextLevel) * 100;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Farm Stats */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Welcome to your Farm!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Farmer Level Card */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Farmer Level</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-farm-green rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userData.level}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to level {userData.level + 1}</span>
                    <span>{Math.round(levelProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-farm-green h-2.5 rounded-full" 
                      style={{ width: `${levelProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coins Card */}
            <div className="card">
            <h3 className="text-lg font-semibold mb-2">Farm Treasury</h3>
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-sunny-yellow rounded-full flex items-center justify-center text-2xl">
                💰
                </div>
                <div>
                <p className="text-3xl font-bold text-yellow-600">{userData.coins.toLocaleString()}</p>
                <p className="text-gray-600">Coins available</p>
                <p className="text-xs text-gray-500 mt-1">Earn more by harvesting crops and selling them at the market!</p>
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
    </div>
  );
}
