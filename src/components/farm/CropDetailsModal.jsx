import React from 'react';
import { useGame } from '../../contexts/GameContext';

export default function CropDetailsModal({ crop, onClose }) {
  const { cropCatalog, harvestCrop } = useGame();
  
  if (!crop) return null;
  
  const { type, stage, id, plantedAt, isHarvestable } = crop;
  const cropInfo = cropCatalog[type];
  const progress = crop.growthProgress || 0;
  
  // Calculate time remaining
  const getTimeRemaining = () => {
    if (isHarvestable) return 'Ready to harvest!';
    
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
  };
  
  const timeRemaining = getTimeRemaining();
  
  const handleHarvest = async () => {
    if (isHarvestable) {
      await harvestCrop(id);
      onClose();
    }
  };
  
  const getStageDescription = () => {
    switch (stage) {
      case 'seedling':
        return 'Your plant has just sprouted! Keep it watered.';
      case 'growing':
        return 'The plant is developing nicely. Watch it grow!';
      case 'mature':
        return 'Almost there! The plant is maturing.';
      case 'ready':
        return 'Ready to harvest! Collect your crop now.';
      default:
        return 'Your plant is growing.';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <span className="text-2xl mr-2">{cropInfo.icon}</span>
            {cropInfo.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Growth Progress</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-farm-green h-2.5 rounded-full transition-all duration-1000 ease-linear" 
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Current Stage</p>
              <p className="font-medium">{stage.charAt(0).toUpperCase() + stage.slice(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Planted On</p>
              <p className="font-medium">{plantedAt.toDate().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Remaining</p>
              <p className="font-medium">{timeRemaining}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Value</p>
              <p className="font-medium">{cropInfo.baseValue} coins</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
            <p className="text-sm">{getStageDescription()}</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Close
          </button>
          
          {isHarvestable && (
            <button 
              onClick={handleHarvest}
              className="btn-primary"
            >
              Harvest Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
