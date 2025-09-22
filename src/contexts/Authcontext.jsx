import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginWithEmail, logoutUser, getCurrentUser, setCurrentUser as setCurrentUserService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // Temporary: Add a default panchayat for testing
      if (!user.panchayat) {
        user.panchayat = 'Test Panchayat';
      }
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  async function signup(email, password, username) {
    const response = await registerUser(email, password, username);
    return response;
  }

  async function login(email, password) {
    const response = await loginWithEmail(email, password);
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    return response;
  }

  function logout() {
    logoutUser();
    setCurrentUser(null);
  }

  function handleSetCurrentUser(user) {
    setCurrentUser(user);
    setCurrentUserService(user);
  }

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    setCurrentUser: handleSetCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}