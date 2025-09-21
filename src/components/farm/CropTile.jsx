import React from 'react';
import { useGame } from '../../contexts/GameContext';

export default function CropTile({ cropData, position, onClick }) {
  const { cropCatalog, harvestCrop } = useGame();
  
  if (!cropData) {
    return (
      <div 
        onClick={onClick}
        className="w-full aspect-square rounded-md bg-amber-100 hover:bg-amber-200 cursor-pointer flex items-center justify-center"
      >
        <span className="text-gray-400">+</span>
      </div>
    );
  }
  
  const { type, stage, id, isHarvestable } = cropData;
  const cropInfo = cropCatalog[type];
  
  // Calculate local growth progress for the progress bar
  const progress = cropData.growthProgress || 0;
  
  const getCropStageDisplay = () => {
    switch (stage) {
      case 'seedling':
        return '🌱';
      case 'growing':
        return '🌿';
      case 'mature':
        return cropInfo.icon;
      case 'ready':
        return (
          <div className="relative animate-pulse">
            {cropInfo.icon}
            <span className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
              ✓
            </span>
          </div>
        );
      default:
        return '🌱';
    }
  };
  
  const handleHarvest = (e) => {
    e.stopPropagation();
    if (isHarvestable) {
      harvestCrop(id);
    }
  };
  
  return (
    <div className="w-full aspect-square rounded-md bg-green-100 flex flex-col items-center justify-center p-2 relative">
      {/* Plant Icon */}
      <div className="text-3xl mb-1">
        {getCropStageDisplay()}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
        <div 
          className="bg-farm-green h-1.5 rounded-full transition-all duration-1000 ease-linear" 
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      
      {/* Harvest button */}
      {isHarvestable && (
        <button
          onClick={handleHarvest}
          className="mt-1 text-xs bg-farm-green text-white px-2 py-1 rounded-full hover:bg-green-600 absolute bottom-1"
        >
          Harvest
        </button>
      )}
    </div>
  );
}
