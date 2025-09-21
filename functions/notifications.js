const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

// Send notifications when they're created
exports.sendNotifications = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snapshot, context) => {
    try {
      const notification = snapshot.data();
      
      // Skip if notification is already marked as read
      if (notification.read) return null;
      
      // Get the user's FCM token
      const userDoc = await db.collection('users').doc(notification.userId).get();
      const fcmToken = userDoc.data()?.fcmToken;
      
      if (!fcmToken) {
        console.log(`No FCM token found for user ${notification.userId}`);
        return null;
      }
      
      // Prepare the message
      const message = {
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          notificationId: context.params.notificationId
        },
        token: fcmToken
      };
      
      // Send the notification
      await admin.messaging().send(message);
      console.log(`Notification sent to user ${notification.userId}`);
      return null;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  });
