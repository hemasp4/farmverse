const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

// Update market prices (runs every 6 hours)
exports.updateMarketPrices = functions.pubsub
  .schedule('0 */6 * * *') // Run every 6 hours
  .onRun(async (context) => {
    try {
      // Crop types and their base values
      const crops = {
        wheat: { baseValue: 100, fluctuation: 0.3 },
        corn: { baseValue: 150, fluctuation: 0.25 },
        tomato: { baseValue: 200, fluctuation: 0.4 },
        carrot: { baseValue: 80, fluctuation: 0.2 }
      };
      
      const batch = db.batch();
      
      // Calculate new market prices with some randomness
      Object.entries(crops).forEach(([cropType, data]) => {
        const { baseValue, fluctuation } = data;
        
        // Random fluctuation between -fluctuation and +fluctuation
        const randomFactor = 1 + (Math.random() * 2 * fluctuation - fluctuation);
        const newPrice = Math.round(baseValue * randomFactor);
        
        const marketRef = db.collection('market').doc(cropType);
        batch.set(marketRef, { 
          price: newPrice,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await batch.commit();
      console.log('Market prices updated successfully');
      return null;
    } catch (error) {
      console.error('Error updating market prices:', error);
      return null;
    }
  });
