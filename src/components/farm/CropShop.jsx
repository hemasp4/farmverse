import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/Authcontext';

export default function CropShop({ onClose, onPlant, position }) {
  const { cropCatalog } = useGame();
  const { userData } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  const handlePlant = () => {
    if (!selectedCrop) return;
    onPlant(selectedCrop, position);
    onClose();
  };
  
  const coins = userData?.coins || 0;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Crop Shop</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Coins Display - Prominent at the top */}
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex justify-between items-center">
          <span className="font-medium">Your Coins</span>
          <span className="font-bold text-yellow-700 flex items-center text-lg">
            <span className="text-2xl mr-2">💰</span>
            {coins.toLocaleString()}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Select a crop to plant in your field. Different crops have different growth times and values.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {Object.entries(cropCatalog).map(([type, data]) => {
            const canAfford = userData && userData.coins >= data.cost;
            
            return (
              <div 
                key={type}
                onClick={() => canAfford && setSelectedCrop(type)}
                className={`
                  border rounded-lg p-3 cursor-pointer 
                  ${selectedCrop === type ? 'border-farm-green bg-green-50' : 'border-gray-200'}
                  ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'hover:border-farm-green'}
                  transition-colors
                `}
              >
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">{data.icon}</span>
                  <div>
                    <h4 className="font-medium">{data.name}</h4>
                    <p className={`text-sm ${canAfford ? 'text-yellow-600' : 'text-red-500'} font-medium flex items-center`}>
                      <span className="mr-1">💰</span>
                      {data.cost} coins
                      {!canAfford && <span className="ml-2 text-red-500">(Cannot afford)</span>}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <p>• Grows in {Math.round(data.growthTime / 60000)} minutes</p>
                  <p>• Sells for ~{data.baseValue} coins</p>
                  <p>• Profit: ~{data.baseValue - data.cost} coins</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={handlePlant}
            disabled={!selectedCrop}
            className={`btn-primary ${!selectedCrop ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Plant Crop
          </button>
        </div>
      </div>
    </div>
  );
}
