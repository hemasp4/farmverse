import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Get current market prices
export const getMarketPrices = async () => {
  try {
    const marketSnapshot = await getDocs(collection(db, 'market'));
    const prices = {};
    
    marketSnapshot.forEach((doc) => {
      prices[doc.id] = doc.data().price;
    });
    
    return prices;
  } catch (error) {
    console.error('Error getting market prices:', error);
    throw error;
  }
};

// Get historical market prices
export const getHistoricalPrices = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      collection(db, 'marketHistory'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const priceHistory = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      priceHistory.push({
        date: data.timestamp.toDate().toLocaleDateString(),
        ...data.prices
      });
    });
    
    return priceHistory.reverse();
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

// Sell a crop at current market price
export const sellCrop = async (userId, cropType, quantity, marketPrices, cropCatalog) => {
  try {
    // Get current price
    const price = marketPrices[cropType] || cropCatalog[cropType].baseValue;
    const totalEarnings = price * quantity;
    
    // Record the transaction
    await addDoc(collection(db, 'transactions'), {
      userId,
      cropType,
      quantity,
      pricePerUnit: price,
      totalEarnings,
      timestamp: Timestamp.now(),
      type: 'sell'
    });
    
    return {
      cropType,
      quantity,
      pricePerUnit: price,
      totalEarnings
    };
  } catch (error) {
    console.error('Error selling crop:', error);
    throw error;
  }
};

// Get market trend (increasing, decreasing, stable)
export const getMarketTrend = async (cropType) => {
  try {
    // Get last 2 days of prices
    const q = query(
      collection(db, 'marketHistory'),
      orderBy('timestamp', 'desc'),
      limit(2)
    );
    
    const querySnapshot = await getDocs(q);
    const prices = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.prices && data.prices[cropType]) {
        prices.push(data.prices[cropType]);
      }
    });
    
    if (prices.length < 2) return 'stable';
    
    const percentChange = ((prices[0] - prices[1]) / prices[1]) * 100;
    
    if (percentChange > 5) return 'increasing';
    if (percentChange < -5) return 'decreasing';
    return 'stable';
  } catch (error) {
    console.error('Error getting market trend:', error);
    return 'stable';
  }
};

// Get user's sales history
export const getUserSalesHistory = async (userId) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      where('type', '==', 'sell'),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const transactions = [];
    
    querySnapshot.forEach(doc => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return transactions;
  } catch (error) {
    console.error('Error getting user sales history:', error);
    throw error;
  }
};
