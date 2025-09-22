import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'x-auth-token': token,
    },
  };
};

// Create a new notification
export const createNotification = async (title, message, type, data) => {
  const response = await axios.post(API_URL, { title, message, type, data }, getAuthConfig());
  return response.data;
};

// Get user's notifications
export const getNotifications = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.put(`${API_URL}/${notificationId}/read`, null, getAuthConfig());
  return response.data;
};