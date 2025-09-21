// src/services/networkUtils.js
export const checkFirebaseConnectivity = async () => {
  try {
    const response = await fetch('https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen', {
      method: 'OPTIONS',
      mode: 'cors'
    });
    return response.ok;
  } catch (error) {
    console.error('Firebase connectivity check failed:', error);
    return false;
  }
};
