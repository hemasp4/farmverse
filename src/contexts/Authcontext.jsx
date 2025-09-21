import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { clearCache } from '../services/cacheService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with username
      await updateProfile(user, {
        displayName: username
      });
      
      // Create user document in Firestore with initial 500 coins
      const userData = {
        username,
        email,
        coins: 500,
        land: 4,
        experience: 0,
        level: 1,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        profileSetupComplete: false
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      // Set userData immediately to ensure coins are displayed
      setUserData({
        ...userData,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      // Store user ID for prefetching
      localStorage.setItem('farmverse_userId', user.uid);
      
      return userCredential;
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Immediately fetch user data to ensure coins are displayed
      await fetchUserData(userCredential.user.uid);
      
      // Update last login time
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp()
      });
      
      // Store user ID for prefetching
      localStorage.setItem('farmverse_userId', userCredential.user.uid);
      
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user with 500 coins
        const userData = {
          username: user.displayName || `Farmer-${user.uid.substring(0, 5)}`,
          email: user.email,
          coins: 500,
          land: 4,
          experience: 0,
          level: 1,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          profileSetupComplete: false
        };
        
        await setDoc(userDocRef, userData);
        
        // Set userData immediately
        setUserData({
          ...userData,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      } else {
        // Update last login time
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp()
        });
        
        // Fetch and set user data
        await fetchUserData(user.uid);
      }
      
      // Store user ID for prefetching
      localStorage.setItem('farmverse_userId', user.uid);
      
      return result;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  }

  function logout() {
    // Clear user-specific cache on logout
    clearCache();
    localStorage.removeItem('farmverse_userId');
    setUserData(null); // Clear user data immediately
    return signOut(auth);
  }

  async function fetchUserData(uid) {
    try {
      console.log("Fetching user data for:", uid);
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("User data fetched:", data);
        setUserData(data);
        return data;
      } else {
        console.log("No user data found");
        setUserData(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  // Check for daily login reward and add 50 coins if eligible
  async function checkDailyLoginReward(uid) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) return { rewarded: false, coins: 0 };
      
      const userData = userDoc.data();
      const lastLogin = userData.lastLogin ? new Date(userData.lastLogin.toDate()) : null;
      const now = new Date();
      
      // If no last login or last login was not today (different day)
      if (!lastLogin || lastLogin.toDateString() !== now.toDateString()) {
        const DAILY_REWARD = 50;
        
        // Update last login and add daily reward
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
          coins: userData.coins + DAILY_REWARD
        });
        
        // Refresh user data
        const updatedData = await fetchUserData(uid);
        
        return { 
          rewarded: true, 
          coins: DAILY_REWARD,
          totalCoins: updatedData.coins 
        };
      }
      
      return { rewarded: false, coins: 0, totalCoins: userData.coins };
    } catch (error) {
      console.error("Error checking daily login:", error);
      return { rewarded: false, coins: 0, error: error.message };
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user?.uid);
      setCurrentUser(user);
      
      if (user) {
        localStorage.setItem('farmverse_userId', user.uid);
        await fetchUserData(user.uid);
      } else {
        localStorage.removeItem('farmverse_userId');
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    googleSignIn,
    logout,
    fetchUserData,
    checkDailyLoginReward,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
