import React from 'react';
import { useGame } from '../../contexts/GameContext';

export default function NotificationCenter() {
  const { notifications, markNotificationAsRead } = useGame();
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'harvest':
        return '🌾';
      case 'growth':
        return '🌱';
      case 'reward':
        return '🎁';
      case 'market':
        return '💰';
      default:
        return '📣';
    }
  };
  
  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {notifications.length > 0 && (
          <span className="bg-farm-green text-white text-xs font-medium rounded-full px-2 py-1">
            {notifications.length}
          </span>
        )}
      </div>
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className="p-3 bg-green-50 rounded-lg border border-green-100"
            >
              <div className="flex">
                <div className="text-2xl mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {notification.createdAt.toDate().toLocaleString()}
                    </span>
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-farm-green hover:underline"
                    >
                      Mark as read
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-5xl mb-2">📬</p>
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
