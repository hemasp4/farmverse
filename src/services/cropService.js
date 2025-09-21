import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

// Plant a new crop
export const plantCrop = async (userId, cropType, position, cropCatalog) => {
  try {
    const plantedAt = Timestamp.now();
    const growthTime = cropCatalog[cropType].growthTime;
    const harvestTime = new Date(plantedAt.toDate().getTime() + growthTime);
    
    const cropRef = await addDoc(collection(db, 'crops'), {
      userId,
      type: cropType,
      plantedAt,
      harvestTime: Timestamp.fromDate(harvestTime),
      position,
      stage: 'seedling',
      isHarvestable: false
    });
    
    return cropRef.id;
  } catch (error) {
    console.error('Error planting crop:', error);
    throw error;
  }
};

// Get user's crops
export const getUserCrops = async (userId) => {
  try {
    const cropsQuery = query(
      collection(db, 'crops'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(cropsQuery);
    const crops = [];
    
    querySnapshot.forEach((doc) => {
      crops.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return crops;
  } catch (error) {
    console.error('Error getting user crops:', error);
    throw error;
  }
};

// Harvest a crop
export const harvestCrop = async (userId, cropId, marketPrices, cropCatalog) => {
  try {
    // Get the crop data
    const cropRef = doc(db, 'crops', cropId);
    const cropSnap = await getDocs(cropRef);
    
    if (!cropSnap.exists()) {
      throw new Error('Crop not found');
    }
    
    const cropData = cropSnap.data();
    
    // Verify the crop belongs to the user and is harvestable
    if (cropData.userId !== userId || !cropData.isHarvestable) {
      throw new Error('Cannot harvest this crop');
    }
    
    // Calculate earnings based on market price
    const cropType = cropData.type;
    const marketPrice = marketPrices[cropType] || cropCatalog[cropType].baseValue;
    
    // Update user coins and experience
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      coins: increment(marketPrice),
      experience: increment(10)
    });
    
    // Delete the harvested crop
    await deleteDoc(cropRef);
    
    return {
      earnings: marketPrice,
      cropType
    };
  } catch (error) {
    console.error('Error harvesting crop:', error);
    throw error;
  }
};

// Update crop stage
export const updateCropStage = async (cropId, stage, isHarvestable = false) => {
  try {
    const cropRef = doc(db, 'crops', cropId);
    await updateDoc(cropRef, {
      stage,
      isHarvestable
    });
  } catch (error) {
    console.error('Error updating crop stage:', error);
    throw error;
  }
};

// Get crop growth progress
export const getCropGrowthProgress = (crop) => {
  if (!crop.plantedAt || !crop.harvestTime) return 0;
  
  const plantedTime = crop.plantedAt.toDate().getTime();
  const harvestTime = crop.harvestTime.toDate().getTime();
  const currentTime = new Date().getTime();
  
  const totalGrowthTime = harvestTime - plantedTime;
  const elapsedTime = currentTime - plantedTime;
  
  return Math.min(Math.max(elapsedTime / totalGrowthTime, 0), 1);
};

// Calculate time remaining until harvest
export const getTimeRemaining = (crop) => {
  if (crop.isHarvestable) return 'Ready to harvest!';
  
  const harvestTime = crop.harvestTime.toDate().getTime();
  const currentTime = new Date().getTime();
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
