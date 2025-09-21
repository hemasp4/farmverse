import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  updateDoc,
  doc,
  Timestamp,
  limit 
} from 'firebase/firestore';
import { db } from './firebase';

// Create a new notification
export const createNotification = async (userId, title, message, type, data = {}) => {
  try {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      data,
      read: false,
      createdAt: Timestamp.now()
    });
    
    return notificationRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get user's unread notifications
export const getUnreadNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    throw error;
  }
};

// Get user's recent notifications (both read and unread)
export const getRecentNotifications = async (userId, limit = 20) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error getting recent notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = db.batch();
    
    querySnapshot.forEach(document => {
      batch.update(doc(db, 'notifications', document.id), { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Create notification for crop growth stage
export const createCropStageNotification = async (userId, cropId, cropType, stage) => {
  let title, message;
  
  switch (stage) {
    case 'seedling':
      title = 'Crop Planted';
      message = `Your ${cropType} has been planted and is sprouting!`;
      break;
    case 'growing':
      title = 'Crop Growing';
      message = `Your ${cropType} is growing nicely!`;
      break;
    case 'mature':
      title = 'Crop Maturing';
      message = `Your ${cropType} is almost ready to harvest!`;
      break;
    case 'ready':
      title = 'Crop Ready!';
      message = `Your ${cropType} is ready to harvest!`;
      break;
    default:
      title = 'Crop Update';
      message = `Your ${cropType} has updated.`;
  }
  
  return createNotification(userId, title, message, 'crop', { cropId, cropType, stage });
};

// Create notification for market price change
export const createMarketPriceNotification = async (userId, cropType, oldPrice, newPrice) => {
  const percentChange = ((newPrice - oldPrice) / oldPrice) * 100;
  const isIncrease = newPrice > oldPrice;
  
  let title, message;
  
  if (Math.abs(percentChange) > 20) {
    title = `${isIncrease ? 'Huge Price Increase!' : 'Major Price Drop!'}`;
    message = `${cropType} prices have ${isIncrease ? 'surged' : 'plummeted'} by ${Math.abs(Math.round(percentChange))}%! ${isIncrease ? 'Great time to sell!' : 'Not a good time to sell.'}`;
  } else {
    title = `Market Price Update`;
    message = `${cropType} prices have ${isIncrease ? 'increased' : 'decreased'} by ${Math.abs(Math.round(percentChange))}%.`;
  }
  
  return createNotification(userId, title, message, 'market', { 
    cropType, 
    oldPrice, 
    newPrice, 
    percentChange 
  });
};
