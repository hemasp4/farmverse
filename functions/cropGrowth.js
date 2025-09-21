const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

// Crop growth stages
const GROWTH_STAGES = ['seedling', 'growing', 'mature', 'ready'];

// Update crop growth (runs every hour)
exports.updateCropGrowth = functions.pubsub
  .schedule('0 * * * *') // Run every hour
  .onRun(async (context) => {
    try {
      const now = admin.firestore.Timestamp.now();
      
      // Get all planted crops
      const cropsSnapshot = await db.collection('crops')
        .where('isHarvestable', '==', false)
        .get();
      
      const batch = db.batch();
      const notifications = [];
      
      cropsSnapshot.forEach((cropDoc) => {
        const crop = cropDoc.data();
        const cropRef = db.collection('crops').doc(cropDoc.id);
        
        // Calculate growth progress (0 to 1)
        const plantedTime = crop.plantedAt.toDate().getTime();
        const harvestTime = crop.harvestTime.toDate().getTime();
        const currentTime = now.toDate().getTime();
        const progress = (currentTime - plantedTime) / (harvestTime - plantedTime);
        
        let updates = {};
        
        if (progress >= 1) {
          // Crop is ready to harvest
          updates = {
            stage: 'ready',
            isHarvestable: true
          };
          
          // Add notification for harvestable crop
          notifications.push({
            userId: crop.userId,
            title: 'Crop Ready!',
            message: `Your ${crop.type} is ready to harvest!`,
            type: 'harvest',
            cropId: cropDoc.id,
            read: false,
            createdAt: now
          });
        } else {
          // Update growth stage based on progress
          const stageIndex = Math.min(
            Math.floor(progress * GROWTH_STAGES.length),
            GROWTH_STAGES.length - 2 // Prevent setting to 'ready' before fully grown
          );
          
          updates = {
            stage: GROWTH_STAGES[stageIndex]
          };
          
          // If transitioning to a new stage, create notification
          if (crop.stage !== GROWTH_STAGES[stageIndex]) {
            notifications.push({
              userId: crop.userId,
              title: 'Crop Update',
              message: `Your ${crop.type} has reached the ${GROWTH_STAGES[stageIndex]} stage!`,
              type: 'growth',
              cropId: cropDoc.id,
              read: false,
              createdAt: now
            });
          }
        }
        
        batch.update(cropRef, updates);
      });
      
      // Add all notifications
      for (const notification of notifications) {
        const notificationRef = db.collection('notifications').doc();
        batch.set(notificationRef, notification);
      }
      
      await batch.commit();
      console.log(`Updated ${cropsSnapshot.size} crops and created ${notifications.length} notifications`);
      return null;
    } catch (error) {
      console.error('Error updating crop growth:', error);
      return null;
    }
  });
