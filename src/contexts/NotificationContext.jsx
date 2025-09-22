import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/notificationService';
import { useAuth } from './Authcontext';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId) {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  const value = {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
