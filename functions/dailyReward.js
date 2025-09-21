const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

// Daily reward function (runs once per day)
exports.processDailyRewards = functions.pubsub
  .schedule('0 0 * * *') // Runs at midnight every day
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      // Get all users
      const usersSnapshot = await db.collection('users').get();
      
      const batch = db.batch();
      const rewardAmount = 50; // Daily login reward coins
      
      usersSnapshot.forEach((userDoc) => {
        const userRef = db.collection('users').doc(userDoc.id);
        
        // Add daily reward coins
        batch.update(userRef, {
          coins: admin.firestore.FieldValue.increment(rewardAmount)
        });
        
        // Create notification for the user
        const notificationRef = db.collection('notifications').doc();
        batch.set(notificationRef, {
          userId: userDoc.id,
          title: 'Daily Reward!',
          message: `You've received ${rewardAmount} coins as your daily login reward.`,
          type: 'reward',
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await batch.commit();
      console.log(`Processed daily rewards for ${usersSnapshot.size} users`);
      return null;
    } catch (error) {
      console.error('Error processing daily rewards:', error);
      return null;
    }
  });
