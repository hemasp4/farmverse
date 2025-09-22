import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Register a new user
export const registerUser = async (email, password, username) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login with email and password
export const loginWithEmail = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user && user !== 'undefined') {
    return JSON.parse(user);
  }
  return null;
};

// Set current user in local storage
export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};