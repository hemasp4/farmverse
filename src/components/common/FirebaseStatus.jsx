import React, { useState, useEffect } from 'react';
import { db, auth } from '../../services/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export default function FirebaseStatus() {
  const [status, setStatus] = useState({
    auth: 'unknown',
    firestore: 'unknown',
    testing: true,
    expanded: false
  });

  useEffect(() => {
    const checkServices = async () => {
      // Check Auth
      let authStatus = 'error';
      try {
        if (auth) {
          authStatus = 'connected';
        }
      } catch (error) {
        authStatus = 'error';
        console.error('Auth check error:', error);
      }

      // Check Firestore
      let firestoreStatus = 'error';
      try {
        await getDocs(query(collection(db, 'market'), limit(1)));
        firestoreStatus = 'connected';
      } catch (error) {
        firestoreStatus = 'error';
        console.error('Firestore check error:', error);
      }

      setStatus({
        ...status,
        auth: authStatus,
        firestore: firestoreStatus,
        testing: false
      });
    };

    checkServices();
    
    // Check periodically
    const interval = setInterval(checkServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpanded = () => {
    setStatus({...status, expanded: !status.expanded});
  };

  if (!status.testing && status.auth === 'connected' && status.firestore === 'connected' && !status.expanded) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button 
          onClick={toggleExpanded}
          className="bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-50 text-sm max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold">Firebase Status</h4>
        <button 
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {status.expanded ? '−' : '+'}
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="mr-2">Auth:</span>
          <span className={`w-2 h-2 rounded-full mr-1 ${
            status.auth === 'connected' ? 'bg-green-500' : 
            status.auth === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></span>
          <span>{status.auth}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Firestore:</span>
          <span className={`w-2 h-2 rounded-full mr-1 ${
            status.firestore === 'connected' ? 'bg-green-500' : 
            status.firestore === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></span>
          <span>{status.firestore}</span>
        </div>
      </div>
      
      {status.expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">
            If services are down, the app will use cached data and offline mode when available.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Refresh App
          </button>
        </div>
      )}
    </div>
  );
}
