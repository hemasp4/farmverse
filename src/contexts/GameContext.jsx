import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './Authcontext';
import { getUserCrops, plantCrop as plantCropService, harvestCrop as harvestCropService } from '../services/cropService';
import { getMarketPrices } from '../services/marketService';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const { currentUser, setCurrentUser } = useAuth();
  const [crops, setCrops] = useState([]);
  const [marketPrices, setMarketPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [coinAnimation, setCoinAnimation] = useState({ isVisible: false, amount: 0 });

  const cropCatalog = {
    wheat: { 
      name: 'Wheat', 
      growthTime: 2 * 60 * 1000, // 2 minutes
      baseValue: 100,
      cost: 50,
      icon: '🌾'
    },
    corn: { 
      name: 'Corn', 
      growthTime: 3 * 60 * 1000, // 3 minutes
      baseValue: 150,
      cost: 75,
      icon: '🌽'
    },
    tomato: { 
      name: 'Tomato', 
      growthTime: 4 * 60 * 1000, // 4 minutes
      baseValue: 200,
      cost: 100,
      icon: '🍅'
    },
    carrot: { 
      name: 'Carrot', 
      growthTime: 1 * 60 * 1000, // 1 minute
      baseValue: 80,
      cost: 40,
      icon: '🥕'
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setCrops([]);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const [userCrops, marketData] = await Promise.all([
          getUserCrops(),
          getMarketPrices(),
        ]);
        setCrops(userCrops);
        setMarketPrices(marketData.reduce((acc, item) => {
          acc[item.cropName] = item.price;
          return acc;
        }, {}));
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUser]);

  async function plantCrop(cropType, position) {
    try {
      const { crop: newCrop, user: updatedUser } = await plantCropService(cropType, position, cropCatalog);
      setCrops([...crops, newCrop]);
      setCurrentUser(updatedUser); // Update currentUser in AuthContext
    } catch (error) {
      console.error("Error planting crop:", error);
    }
  }

  async function harvestCrop(cropId) {
    try {
      const { user: updatedUser } = await harvestCropService(cropId, marketPrices, cropCatalog);
      setCrops(crops.filter(c => c._id !== cropId));
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error harvesting crop:", error);
    }
  }

  const showCoinChange = (amount) => {
    setCoinAnimation({ isVisible: true, amount });
  };

  const value = {
    crops,
    marketPrices,
    cropCatalog,
    plantCrop,
    harvestCrop,
    loading,
    coinAnimation,
    setCoinAnimation,
    showCoinChange,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}