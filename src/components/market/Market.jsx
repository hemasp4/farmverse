import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/Authcontext';
import MarketPriceChart from './MarketPriceChart';

export default function Market() {
  const { cropCatalog, marketPrices, crops, harvestCrop } = useGame();
  const { userData } = useAuth();
  const [selectedTab, setSelectedTab] = useState('prices');
  
  // Get harvestable crops
  const harvestableCrops = crops.filter(crop => crop.isHarvestable);
  
  // Group harvestable crops by type
  const groupedCrops = harvestableCrops.reduce((acc, crop) => {
    if (!acc[crop.type]) {
      acc[crop.type] = [];
    }
    acc[crop.type].push(crop);
    return acc;
  }, {});
  
  const handleHarvestAll = async (cropType) => {
    const cropsToHarvest = groupedCrops[cropType];
    if (!cropsToHarvest || cropsToHarvest.length === 0) return;
    
    // Harvest all crops of this type
    for (const crop of cropsToHarvest) {
      await harvestCrop(crop.id);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Farmer's Market</h1>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            selectedTab === 'prices' 
              ? 'text-farm-green border-b-2 border-farm-green' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setSelectedTab('prices')}
        >
          Market Prices
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            selectedTab === 'sell' 
              ? 'text-farm-green border-b-2 border-farm-green' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setSelectedTab('sell')}
        >
          Sell Crops
        </button>
      </div>
      
      {selectedTab === 'prices' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(cropCatalog).map(([type, data]) => {
              const currentPrice = marketPrices[type] || data.baseValue;
              const basePrice = data.baseValue;
              const priceChange = currentPrice - basePrice;
              const priceChangePercent = (priceChange / basePrice) * 100;
              
              return (
                <div key={type} className="card">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{data.icon}</span>
                    <span className="font-medium">{data.name}</span>
                  </div>
                  <div className="text-2xl font-bold">{currentPrice} coins</div>
                  <div className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChangePercent).toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Price Trends</h3>
            <MarketPriceChart />
          </div>
        </div>
      )}
      
      {selectedTab === 'sell' && (
        <div>
          {Object.keys(groupedCrops).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedCrops).map(([type, cropsList]) => {
                const cropInfo = cropCatalog[type];
                const price = marketPrices[type] || cropInfo.baseValue;
                const totalValue = price * cropsList.length;
                
                return (
                  <div key={type} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{cropInfo.icon}</span>
                        <div>
                          <h3 className="font-medium">{cropInfo.name}</h3>
                          <p className="text-sm text-gray-600">
                            {cropsList.length} ready to harvest • {price} coins each
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold">{totalValue} coins</p>
                        <button
                          onClick={() => handleHarvestAll(type)}
                          className="btn-primary text-sm mt-2"
                        >
                          Harvest & Sell All
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="text-5xl mb-3">🌱</div>
              <h3 className="text-xl font-medium mb-2">No crops ready for harvest</h3>
              <p className="text-gray-600 mb-4">
                Visit your farm to check on your growing crops.
              </p>
              <a href="/farm" className="btn-primary inline-block">
                Go to Farm
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
