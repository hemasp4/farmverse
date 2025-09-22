import React from 'react';
import { useAuth } from '../../contexts/Authcontext';
import { useGame } from '../../contexts/GameContext';
import ProgressBar from '../common/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function FarmStats() {
  const { userData } = useAuth();
  const { crops, cropCatalog } = useGame();
  
  if (!userData) {
    return <div className="text-center py-4">Loading farm statistics...</div>;
  }
  
  // Calculate next level XP requirement
  const expToNextLevel = userData.level * 100;
  const levelProgress = (userData.experience / expToNextLevel) * 100;
  
  // Calculate farm stats
  const totalCrops = crops.length;
  const harvestReady = crops.filter(crop => crop.isHarvestable).length;
  const totalLand = userData.land;
  const usedLand = totalCrops;
  const landUsagePercent = (usedLand / totalLand) * 100;
  
  // Create crop type distribution data for the chart
  const getCropTypesData = () => {
    const typeCounts = {};
    
    // Count crops by type
    crops.forEach(crop => {
      if (typeCounts[crop.type]) {
        typeCounts[crop.type]++;
      } else {
        typeCounts[crop.type] = 1;
      }
    });
    
    // Convert to array format for chart
    return Object.entries(typeCounts).map(([type, count]) => ({
      name: cropCatalog[type].name,
      count: count,
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
  
  const cropData = getCropTypesData();
  
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Farm Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Farmer Level Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Farmer Level {userData.level}</span>
            <span className="text-sm text-gray-500">{userData.experience}/{expToNextLevel} XP</span>
          </div>
          <ProgressBar 
            progress={levelProgress} 
            color="bg-farm-green" 
            height="h-3"
            showPercentage={true}
          />
        </div>
        
        {/* Land Usage */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Land Usage</span>
            <span className="text-sm text-gray-500">{usedLand}/{totalLand} plots</span>
          </div>
          <ProgressBar 
            progress={landUsagePercent} 
            color="bg-soil-brown" 
            height="h-3"
            showPercentage={true}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Crops Planted */}
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">Total Crops</p>
          <p className="text-3xl font-bold text-farm-green">{totalCrops}</p>
          <p className="text-xs text-gray-500">planted on your farm</p>
        </div>
        
        {/* Harvest Ready */}
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">Ready to Harvest</p>
          <p className="text-3xl font-bold text-yellow-600">{harvestReady}</p>
          <p className="text-xs text-gray-500">crops awaiting harvest</p>
        </div>
        
        {/* Estimated Value */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">Farm Value</p>
          <p className="text-3xl font-bold text-blue-600">
            {userData.coins + (totalCrops * 75)} {/* Simple estimation */}
          </p>
          <p className="text-xs text-gray-500">total farm worth</p>
        </div>
      </div>
      
      {/* Crop Distribution Chart */}
      {cropData.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Crop Distribution</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Count">
                  {cropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
