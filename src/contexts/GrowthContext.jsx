import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGame } from './GameContext';

const GrowthContext = createContext();

export function useGrowth() {
  return useContext(GrowthContext);
}

export function GrowthProvider({ children }) {
  const { crops } = useGame();
  const [localCrops, setLocalCrops] = useState([]);
  
  // Update local crops whenever server data changes
  useEffect(() => {
    if (crops.length > 0) {
      setLocalCrops(crops.map(crop => ({
        ...crop,
        growthProgress: calculateGrowthProgress(crop)
      })));
    }
  }, [crops]);
  
  // Update growth progress every second for smoother UI updates
  useEffect(() => {
    if (localCrops.length === 0) return;
    
    const interval = setInterval(() => {
      setLocalCrops(prevCrops => 
        prevCrops.map(crop => {
          const updatedProgress = calculateGrowthProgress(crop);
          
          // Determine if crop should transition to harvestable based on local calculation
          let updatedCrop = { ...crop, growthProgress: updatedProgress };
          updatedCrop.isHarvestable = updatedProgress >= 1;
          
          if (updatedProgress >= 1) {
            updatedCrop.stage = 'ready';
          } else if (updatedProgress >= 0.66 && crop.stage !== 'mature' && crop.stage !== 'ready') {
            updatedCrop.stage = 'mature';
          } else if (updatedProgress >= 0.33 && crop.stage !== 'growing' && crop.stage !== 'mature' && crop.stage !== 'ready') {
            updatedCrop.stage = 'growing';
          }
          
          return updatedCrop;
        })
      );
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [localCrops]);
  
  // Calculate growth progress (0 to 1) based on current time
  const calculateGrowthProgress = (crop) => {
    if (!crop.plantedAt || !crop.harvestTime) return 0;
    
    const plantedTime = new Date(crop.plantedAt).getTime();
    const harvestTime = new Date(crop.harvestTime).getTime();
    const currentTime = Date.now();
    
    return Math.min(Math.max((currentTime - plantedTime) / (harvestTime - plantedTime), 0), 1);
  };
  
  // Get remaining time in human-readable format
  const getTimeRemaining = (crop) => {
    if (crop.isHarvestable) return 'Ready to harvest!';

    try{
    const harvestTime = new Date(crop.harvestTime).getTime();
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
  }catch(error){
    console.error("Error calculating time remaining:", error);
      return "Time unknown";
  }};
  
  const value = {
    localCrops,
    getTimeRemaining
  };
  
  return (
    <GrowthContext.Provider value={value}>
      {children}
    </GrowthContext.Provider>
  );
}