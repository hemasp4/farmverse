import React, { createContext, useContext, useState, useEffect,useRef } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  where, 
  onSnapshot, 
  Timestamp,
  increment,
  limit,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './Authcontext';
import { getCachedData, setCachedData } from '../services/cacheService';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const { currentUser, userData } = useAuth();
  const [crops, setCrops] = useState([]);
  const [marketPrices, setMarketPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [coinAnimation, setCoinAnimation] = useState({
  isVisible: false,
  amount: 0
});



    const showCoinChange = (amount) => {
    setCoinAnimation({
    isVisible: true,
    amount
    });
    };
  // Crop catalog with growth times and base values
  const cropCatalog = {
    wheat: { 
      name: 'Wheat', 
      growthTime: process.env.NODE_ENV === 'production'
        ? 3 * 24 * 60 * 60 * 1000  // 3 days in production
        : 2 * 60 * 1000,           // 2 minutes in development
      baseValue: 100,
      cost: 50,
      icon: '🌾'
    },
    corn: { 
      name: 'Corn', 
      growthTime: process.env.NODE_ENV === 'production'
        ? 5 * 24 * 60 * 60 * 1000  // 5 days in production
        : 3 * 60 * 1000,           // 3 minutes in development
      baseValue: 150,
      cost: 75,
      icon: '🌽'
    },
    tomato: { 
      name: 'Tomato', 
      growthTime: process.env.NODE_ENV === 'production'
        ? 7 * 24 * 60 * 60 * 1000  // 7 days in production
        : 4 * 60 * 1000,           // 4 minutes in development
      baseValue: 200,
      cost: 100,
      icon: '🍅'
    },
    carrot: { 
      name: 'Carrot', 
      growthTime: process.env.NODE_ENV === 'production'
        ? 2 * 24 * 60 * 60 * 1000  // 2 days in production
        : 1 * 60 * 1000,           // 1 minute in development
      baseValue: 80,
      cost: 40,
      icon: '🥕'
    }
  };

  // Load user's crops with optimized query and error handling
  useEffect(() => {
    if (!currentUser) {
      setCrops([]);
      setLoading(false);
      return;
    }

    let unsubscribe;
    try {
      // Use a more efficient query with ordering
      const q = query(
        collection(db, 'crops'),
        where('userId', '==', currentUser.uid),
        orderBy('plantedAt', 'desc'),
        limit(20)
      );

      // Use the onSnapshot with error handling
      unsubscribe = onSnapshot(
        q, 
        (querySnapshot) => {
          const cropsArray = [];
          querySnapshot.forEach((doc) => {
            cropsArray.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setCrops(cropsArray);
          setLoading(false);
        },
        (error) => {
          console.error("Error listening to crops:", error);
          // Use mock data as fallback
          setCrops(getMockCrops(currentUser.uid));
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up crops listener:", error);
      setCrops([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  // Load market prices with caching
  useEffect(() => {
    if (!currentUser) return;

    const loadMarketPrices = async () => {
      try {
        // Try to get cached market prices first
        const cachedPrices = getCachedData('marketPrices');
        if (cachedPrices) {
          setMarketPrices(cachedPrices);
        }

        // Set up real-time listener
        const unsubscribe = onSnapshot(
          collection(db, 'market'), 
          (snapshot) => {
            const prices = {};
            snapshot.forEach((doc) => {
              prices[doc.id] = doc.data().price;
            });
            setMarketPrices(prices);
            // Cache the latest prices
            setCachedData('marketPrices', prices);
          },
          (error) => {
            console.error("Error listening to market prices:", error);
            // If we don't have cached data, use fallbacks
            if (!cachedPrices) {
              setMarketPrices({
                wheat: 100,
                corn: 150,
                tomato: 200,
                carrot: 80
              });
            }
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up market prices listener:", error);
        setMarketPrices({
          wheat: 100,
          corn: 150,
          tomato: 200,
          carrot: 80
        });
        return () => {};
      }
    };

    const unsubscribe = loadMarketPrices();
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser]);

  // Load notifications with optimized query
  useEffect(() => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid),
        where('read', '==', false),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificationsArray = [];
        querySnapshot.forEach((doc) => {
          notificationsArray.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setNotifications(notificationsArray);
      }, (error) => {
        console.error("Error listening to notifications:", error);
        setNotifications([]);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up notifications listener:", error);
      setNotifications([]);
      return () => {};
    }
  }, [currentUser]);

  // Plant a new crop
  async function plantCrop(cropType, position) {
  if (!currentUser || !userData) {
    console.error("Cannot plant crop: User data not available");
    return;
  }

  const cropCost = cropCatalog[cropType].cost;

  // Check if user has enough coins
  if (userData.coins < cropCost) {
    console.error("Not enough coins to plant this crop");
    return;
  }

  try {
    const plantedAt = Timestamp.now();
    const growthTime = cropCatalog[cropType].growthTime;
    const harvestTime = new Date(plantedAt.toDate().getTime() + growthTime);

    await addDoc(collection(db, 'crops'), {
      userId: currentUser.uid,
      type: cropType,
      plantedAt,
      harvestTime: Timestamp.fromDate(harvestTime),
      position,
      stage: 'seedling',
      isHarvestable: false
    });

    // Deduct coins for the seed
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      coins: userData.coins - cropCost
    });

    // Show coin animation for spending
    showCoinChange(-cropCost);
  } catch (error) {
    console.error("Error planting crop:", error);
  }
}

// Modify the harvestCrop function:
async function harvestCrop(cropId) {
  if (!currentUser || !userData) {
    console.error("Cannot harvest crop: User data not available");
    return;
  }

  try {
    const cropToHarvest = crops.find(crop => crop.id === cropId);
    if (!cropToHarvest || !cropToHarvest.isHarvestable) {
      throw new Error("Crop is not ready for harvest");
    }

    // Calculate earnings based on market price or base value
    const cropType = cropToHarvest.type;
    const marketPrice = marketPrices[cropType] || cropCatalog[cropType].baseValue;
    const earnings = marketPrice;

    // Update user's coins
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      coins: userData.coins + earnings,
      experience: userData.experience + 10
    });

    // Remove the harvested crop
    await deleteDoc(doc(db, 'crops', cropId));

    // Show coin animation for earnings
    showCoinChange(earnings);

    return earnings;
  } catch (error) {
    console.error("Error harvesting crop:", error);
    throw error;
  }
}


  // Mark notification as read
  async function markNotificationAsRead(notificationId) {
    if (!currentUser) return;

    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Mock data for fallback when Firebase is unavailable
  function getMockCrops(userId) {
    return [
      {
        id: 'mock-crop-1',
        userId,
        type: 'wheat',
        plantedAt: { toDate: () => new Date(Date.now() - 5 * 60 * 1000) },
        harvestTime: { toDate: () => new Date(Date.now() + 5 * 60 * 1000) },
        position: { x: 0, y: 0 },
        stage: 'growing',
        isHarvestable: false
      },
      {
        id: 'mock-crop-2',
        userId,
        type: 'corn',
        plantedAt: { toDate: () => new Date(Date.now() - 10 * 60 * 1000) },
        harvestTime: { toDate: () => new Date(Date.now() - 2 * 60 * 1000) },
        position: { x: 1, y: 0 },
        stage: 'ready',
        isHarvestable: true
      }
    ];
  }

  const value = {
  crops,
  marketPrices,
  cropCatalog,
  notifications,
  plantCrop,
  harvestCrop,
  markNotificationAsRead,
  loading,
  coinAnimation,
  setCoinAnimation
};


  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
