import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore';

// Initialize basic collections and documents
export const initializeFirestore = async () => {
  try {
    console.log("Initializing Firestore collections...");
    
    // Check if market collection exists, if not create it
    const marketCollection = collection(db, 'market');
    const marketSnapshot = await getDocs(marketCollection);
    
    if (marketSnapshot.empty) {
      console.log("Creating market data...");
      // Initialize crop prices
      await setDoc(doc(db, 'market', 'wheat'), { price: 100, updatedAt: Timestamp.now() });
      await setDoc(doc(db, 'market', 'corn'), { price: 150, updatedAt: Timestamp.now() });
      await setDoc(doc(db, 'market', 'tomato'), { price: 200, updatedAt: Timestamp.now() });
      await setDoc(doc(db, 'market', 'carrot'), { price: 80, updatedAt: Timestamp.now() });
    }
    
    // Initialize market history if needed
    const historyCollection = collection(db, 'marketHistory');
    const historySnapshot = await getDocs(historyCollection);
    
    if (historySnapshot.empty) {
      console.log("Creating market history...");
      await setDoc(doc(db, 'marketHistory', 'day_1'), { 
        timestamp: Timestamp.now(),
        prices: {
          wheat: 100,
          corn: 150,
          tomato: 200,
          carrot: 80
        }
      });
    }
    
    console.log("Firestore initialization complete!");
    return true;
  } catch (error) {
    console.error("Error initializing Firestore:", error);
    return false;
  }
};

// Prefetch user data to improve initial loading performance
export const prefetchUserData = async (userId) => {
  if (!userId) return;
  
  try {
    console.log("Prefetching user data...");
    
    // Prefetch user document
    const userDoc = doc(db, 'users', userId);
    
    // Prefetch user's crops
    const cropsQuery = query(
      collection(db, 'crops'),
      where('userId', '==', userId),
      where('isHarvestable', '==', true)
    );
    
    // Prefetch market prices
    const marketCollection = collection(db, 'market');
    
    // Execute all prefetch queries in parallel
    await Promise.all([
      getDocs(doc(db, 'users', userId)),
      getDocs(cropsQuery),
      getDocs(marketCollection)
    ]);
    
    console.log("Prefetching complete");
  } catch (error) {
    console.error('Error prefetching data:', error);
  }
};
