import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FarmGrid from '../components/farm/FarmGrid';
import CropCard from '../components/farm/CropCard';
import { useGame } from '../contexts/GameContext';
import { useGrowth } from '../contexts/GrowthContext';
import CropDetailsModal from '../components/farm/CropDetailsModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function FarmPage() {
  const { crops, loading: gameLoading } = useGame();
  const growth = useGrowth();
  // Provide a fallback if useGrowth() returns undefined
  const localCrops = growth?.localCrops || [];
  
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activeTab, setActiveTab] = useState('farm');
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Use local crops for real-time updates or fall back to server crops
  const displayCrops = localCrops.length > 0 ? localCrops : crops;
  
  // Filter crops by status
  const readyCrops = displayCrops.filter(crop => crop.isHarvestable);
  const growingCrops = displayCrops.filter(crop => !crop.isHarvestable);
  
  // Auto-select farm tab if there are no crops
  useEffect(() => {
    if (displayCrops.length === 0 && !gameLoading) {
      setActiveTab('farm');
    }
    
    // Set page as loaded after a small delay to allow transitions
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [displayCrops, gameLoading]);
  
  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setShowCropDetails(true);
  };
  
  // Show loading state while initial data is loading
  if (pageLoading && gameLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Farm</h1>
          
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab('farm')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'farm'
                  ? 'bg-farm-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Farm Grid
            </button>
            <button
              onClick={() => setActiveTab('ready')}
              className={`px-4 py-2 text-sm font-medium relative ${
                activeTab === 'ready'
                  ? 'bg-farm-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              Ready to Harvest
              {readyCrops.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {readyCrops.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('growing')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'growing'
                  ? 'bg-farm-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-r border-gray-300`}
            >
              Growing
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {growingCrops.length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Farm Grid View */}
        {activeTab === 'farm' && (
          <FarmGrid />
        )}
        
        {/* Ready to Harvest View */}
        {activeTab === 'ready' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ready to Harvest</h2>
            {readyCrops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyCrops.map(crop => (
                  <CropCard 
                    key={crop.id} 
                    crop={crop} 
                    onSelect={handleCropSelect} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <div className="text-5xl mb-3">🌱</div>
                <h3 className="text-xl font-medium mb-2">No crops ready yet</h3>
                <p className="text-gray-600 mb-4">
                  Your crops are still growing. Check back later!
                </p>
                <button 
                  onClick={() => setActiveTab('farm')}
                  className="btn-primary"
                >
                  Go to Farm
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Growing Crops View */}
        {activeTab === 'growing' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Growing Crops</h2>
            {growingCrops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {growingCrops.map(crop => (
                  <CropCard 
                    key={crop.id} 
                    crop={crop} 
                    onSelect={handleCropSelect} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <div className="text-5xl mb-3">🚜</div>
                <h3 className="text-xl font-medium mb-2">No growing crops</h3>
                <p className="text-gray-600 mb-4">
                  Time to plant some seeds and start growing!
                </p>
                <button 
                  onClick={() => setActiveTab('farm')}
                  className="btn-primary"
                >
                  Go to Farm
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Crop Details Modal */}
        {showCropDetails && selectedCrop && (
          <CropDetailsModal 
            crop={selectedCrop} 
            onClose={() => setShowCropDetails(false)} 
          />
        )}
      </div>
    </MainLayout>
  );
}
