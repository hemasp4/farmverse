import React, { useState, useEffect } from 'react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowMessage(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showMessage) return null;

  return (
    <div className={`fixed bottom-16 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      isOnline ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
    }`}>
      {isOnline ? (
        <div className="flex items-center text-green-800">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span>You're back online!</span>
          <button 
            onClick={() => setShowMessage(false)}
            className="ml-4 text-sm text-green-700 hover:text-green-900"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex items-center text-red-800">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span>You're offline. Some features may be limited.</span>
        </div>
      )}
    </div>
  );
}
