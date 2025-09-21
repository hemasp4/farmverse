import React, { useState } from 'react';
import CropTile from './CropTile';
import CropDetailsModal from './CropDetailsModal';
import CropShop from './CropShop';
import { useGame } from '../../contexts/GameContext';
import { useGrowth } from '../../contexts/GrowthContext';
import { useAuth } from '../../contexts/Authcontext';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FarmGrid() {
  const { crops, plantCrop, cropCatalog, loading: gameLoading } = useGame();
  const growth = useGrowth();
  const localCrops = growth?.localCrops || [];
  const { userData } = useAuth();
  
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedCropForDetails, setSelectedCropForDetails] = useState(null);

  // Calculate grid size based on user's land
  const gridSize = userData ? Math.sqrt(userData.land) : 2;
  
  // Create a 2D array representing the farm grid
  const createGrid = () => {
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
    
    // Use localCrops if available, otherwise use server crops
    const cropsToDisplay = localCrops.length > 0 ? localCrops : crops;
    
    // Place existing crops on the grid
    cropsToDisplay.forEach(crop => {
      const { position } = crop;
      if (position && position.x < gridSize && position.y < gridSize) {
        grid[position.y][position.x] = crop;
      }
    });
    
    return grid;
  };
  
  const grid = createGrid();
  
  const handleTileClick = (x, y) => {
    const position = { x, y };
    const existingCrop = grid[y][x];
    
    if (existingCrop) {
      // Show details modal for existing crop
      setSelectedCropForDetails(existingCrop);
    } else {
      // Open plant modal for empty tile
      setSelectedPosition(position);
      setShowPlantModal(true);
    }
  };
  
  const handlePlantCrop = (cropType) => {
    if (!cropType || !selectedPosition) return;
    
    // Check if user has enough coins
    if (userData.coins < cropCatalog[cropType].cost) {
      alert("Not enough coins to plant this crop!");
      return;
    }
    
    // Plant the crop at the selected position
    plantCrop(cropType, selectedPosition);
    
    // Close the modal
    setShowPlantModal(false);
  };

  // Show loading state
  if (gameLoading) {
    return (
      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Your Farm</h2>
        <div className="py-12">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Loading your farm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Your Farm</h2>
      
      <div 
        className="grid gap-2 border-4 border-soil-brown rounded-lg p-4 bg-soil-brown"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: `${gridSize * 100}px`
        }}
      >
        {grid.map((row, y) => 
          row.map((cropData, x) => (
            <CropTile 
              key={`${x}-${y}`}
              cropData={cropData}
              position={{ x, y }}
              onClick={() => handleTileClick(x, y)}
            />
          ))
        )}
      </div>
      
      {/* Plant Crop Modal */}
      {showPlantModal && (
        <CropShop
          onClose={() => setShowPlantModal(false)}
          onPlant={handlePlantCrop}
          position={selectedPosition}
        />
      )}
      
      {/* Crop Details Modal */}
      {selectedCropForDetails && (
        <CropDetailsModal 
          crop={selectedCropForDetails} 
          onClose={() => setSelectedCropForDetails(null)} 
        />
      )}
    </div>
  );
}
