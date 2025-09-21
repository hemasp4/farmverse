import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Register a new user
export const registerUser = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      coins: 500,
      land: 4,
      experience: 0,
      level: 1,
      createdAt: new Date(),
      profileSetupComplete: false
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Login with email and password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // If user doesn't exist in Firestore, create a new document
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        username: user.displayName || `Farmer-${user.uid.substring(0, 5)}`,
        email: user.email,
        coins: 500,
        land: 4,
        experience: 0,
        level: 1,
        createdAt: new Date(),
        profileSetupComplete: false
      });
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Get current user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
  } catch (error) {
    throw error;
  }
};

// Check if user has completed daily login
export const checkDailyLogin = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    const lastLogin = userData.lastLogin ? userData.lastLogin.toDate() : null;
    const now = new Date();
    
    // If no last login or last login was not today
    if (!lastLogin || lastLogin.toDateString() !== now.toDateString()) {
      // Update last login and add daily reward
      await updateDoc(doc(db, 'users', userId), {
        lastLogin: now,
        coins: userData.coins + 50
      });
      
      return true; // Daily login completed
    }
    
    return false; // Already logged in today
  } catch (error) {
    console.error('Error checking daily login:', error);
    return false;
  }
};
