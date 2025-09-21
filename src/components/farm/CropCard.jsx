import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useGrowth } from '../../contexts/GrowthContext';
import ProgressBar from '../common/ProgressBar';

export default function CropCard({ crop, onSelect }) {
  const { cropCatalog } = useGame();
  const growth = useGrowth();
  
  // Provide a fallback for getTimeRemaining
  const getTimeRemaining = (crop) => {
    if (growth?.getTimeRemaining) {
      return growth.getTimeRemaining(crop);
    }
    
    // Fallback implementation
    if (crop.isHarvestable) return 'Ready to harvest!';
    
    try {
      const harvestTime = crop.harvestTime.toDate().getTime();
      const currentTime = Date.now();
      const remainingMs = harvestTime - currentTime;
      
      if (remainingMs <= 0) return 'Ready to harvest!';
      
      const seconds = Math.floor((remainingMs / 1000) % 60);
      const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
      const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      
      if (days > 0) return `${days}d ${hours}h remaining`;
      if (hours > 0) return `${hours}h ${minutes}m remaining`;
      if (minutes > 0) return `${minutes}m ${seconds}s remaining`;
      return `${seconds}s remaining`;
    } catch (error) {
      return 'Time unknown';
    }
  };
  
  if (!crop) return null;
  
  const { type, stage, isHarvestable } = crop;
  const cropInfo = cropCatalog[type];
  const timeRemaining = getTimeRemaining(crop);
  const progress = crop.growthProgress || 0;
  
  const stageDescriptions = {
    seedling: 'Your seed has just sprouted! It needs time to develop.',
    growing: 'Your plant is growing steadily. Patience will be rewarded!',
    mature: 'The plant is nearly mature. Almost ready for harvest!',
    ready: 'Your crop is ready to harvest! Collect it before it withers.'
  };
  
  return (
    <div 
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(crop)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="text-3xl mr-3">{cropInfo.icon}</div>
          <div>
            <h3 className="font-medium">{cropInfo.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{stage} Stage</p>
          </div>
        </div>
        
        {isHarvestable && (
          <span className="bg-yellow-400 text-xs text-white px-2 py-1 rounded-full animate-pulse">
            Ready!
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between mb-1 text-xs">
          <span>Growth Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <ProgressBar 
          progress={progress * 100} 
          color="bg-farm-green" 
          height="h-2"
        />
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{stageDescriptions[stage]}</p>
      
      <div className="text-xs text-gray-500 flex justify-between">
        <span>Plot: {crop.position.x}, {crop.position.y}</span>
        <span>{timeRemaining}</span>
      </div>
    </div>
  );
}
